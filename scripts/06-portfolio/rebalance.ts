import { network } from "hardhat";
const { viem } = await network.connect();
import { parseEther, parseUnits, formatEther, maxUint256 } from "viem";
import { getDeployedAddress } from "../08-helpers/addresses.js";

async function main() {
    const [user] = await viem.getWalletClients();
    const publicClient = await viem.getPublicClient();

    console.log(`Executing rebalance for: ${user.account.address}\n`);

    // Get addresses
    const FACTORY_ADDRESS = await getDeployedAddress("PortfolioModule", "PortfolioFactory");
    const DAI_ADDRESS = await getDeployedAddress("TokensModule", "TestDAI");
    const USDC_ADDRESS = await getDeployedAddress("TokensModule", "TestUSDC");
    const WMON_ADDRESS = await getDeployedAddress("WmonModule", "WMON");

    // Get portfolio
    const factory = await viem.getContractAt("PortfolioFactory", FACTORY_ADDRESS);
    const portfolioAddress = await factory.read.getPortfolio([user.account.address]);

    if (portfolioAddress === "0x0000000000000000000000000000000000000000") {
        console.log("❌ No portfolio found. Run create-portfolio.ts first!");
        return;
    }

    console.log(`Portfolio Address: ${portfolioAddress}\n`);
    const portfolio = await viem.getContractAt("UserPortfolio", portfolioAddress);

    // Check if paused
    const paused = await portfolio.read.paused();
    if (paused) {
        console.log("❌ Portfolio is paused!");
        return;
    }

    // Example rebalance: Swap 100 DAI for USDC via WMON
    // Path: DAI -> WMON -> USDC
    const tokenIn = DAI_ADDRESS;
    const tokenOut = USDC_ADDRESS;
    const amountIn = parseEther("100"); // 100 DAI
    const path = [DAI_ADDRESS, WMON_ADDRESS, USDC_ADDRESS];
    const executor = user.account.address; // In production, this would be your bot address
    const reason = "Manual rebalance test";

    console.log("=== Rebalance Details ===");
    console.log(`Token In:  DAI (${tokenIn})`);
    console.log(`Token Out: USDC (${tokenOut})`);
    console.log(`Amount In: ${formatEther(amountIn)} DAI`);
    console.log(`Path: DAI -> WMON -> USDC`);
    console.log(`Executor: ${executor}`);
    console.log(`Reason: ${reason}\n`);

    // Get estimated output
    try {
        const estimatedAmounts = await portfolio.read.getEstimatedOut([amountIn, path]);
        console.log("=== Estimated Output ===");
        console.log(`DAI Input:  ${formatEther(estimatedAmounts[0])}`);
        console.log(`WMON Mid:   ${formatEther(estimatedAmounts[1])}`);
        console.log(`USDC Output: ${formatEther(estimatedAmounts[2])}\n`);

        // Set minimum output with 1% slippage
        const amountOutMin = (estimatedAmounts[2] * 99n) / 100n;
        console.log(`Minimum Output (1% slippage): ${formatEther(amountOutMin)} USDC\n`);

        // Validate rebalance
        const validation = await portfolio.read.validateRebalance([
            tokenIn,
            tokenOut,
            amountIn,
            amountOutMin,
            path
        ]);

        if (!validation[0]) {
            console.log(`❌ Validation failed: ${validation[1]}`);
            return;
        }

        console.log(`✅ Validation passed: ${validation[1]}\n`);

        // Check user's DAI balance
        const dai = await viem.getContractAt("TestDAI", DAI_ADDRESS);
        const userDaiBalance = await dai.read.balanceOf([user.account.address]);

        if (userDaiBalance < amountIn) {
            console.log(`❌ Insufficient DAI balance. Have: ${formatEther(userDaiBalance)}, Need: ${formatEther(amountIn)}`);
            return;
        }

        console.log(`User DAI Balance: ${formatEther(userDaiBalance)}`);

        // Approve portfolio to spend DAI
        console.log("\nApproving portfolio to spend DAI...");
        const approveHash = await dai.write.approve([portfolioAddress, maxUint256]);
        await publicClient.waitForTransactionReceipt({ hash: approveHash });
        console.log("✅ DAI approved");

        // Get balances before
        const userUsdcBefore = await viem.getContractAt("TestUSDC", USDC_ADDRESS).then(c =>
            c.read.balanceOf([user.account.address])
        );

        console.log("\n=== Executing Rebalance ===");

        // Execute rebalance
        const txHash = await portfolio.write.executeRebalance([
            executor,
            tokenIn,
            tokenOut,
            amountIn,
            amountOutMin,
            path,
            reason
        ]);

        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
        console.log(`✅ Rebalance executed!`);
        console.log(`Transaction: ${txHash}`);
        console.log(`Gas Used: ${receipt.gasUsed}\n`);

        // Get balances after
        const userDaiAfter = await dai.read.balanceOf([user.account.address]);
        const userUsdcAfter = await viem.getContractAt("TestUSDC", USDC_ADDRESS).then(c =>
            c.read.balanceOf([user.account.address])
        );

        console.log("=== Results ===");
        console.log(`DAI Balance:  ${formatEther(userDaiBalance)} -> ${formatEther(userDaiAfter)} (${formatEther(userDaiBalance - userDaiAfter)} spent)`);
        console.log(`USDC Balance: ${formatEther(userUsdcBefore)} -> ${formatEther(userUsdcAfter)} (+${formatEther(userUsdcAfter - userUsdcBefore)} received)`);

    } catch (error: any) {
        console.error("\n❌ Rebalance failed:");
        console.error(error.message || error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
