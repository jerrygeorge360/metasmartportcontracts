import { network } from "hardhat";
const { viem } = await network.connect();
import { getDeployedAddress } from "../08-helpers/addresses.js";

async function main() {
    const [user] = await viem.getWalletClients();

    console.log(`Setting allocation for: ${user.account.address}\n`);

    // Get portfolio address
    const FACTORY_ADDRESS = await getDeployedAddress("PortfolioModule", "PortfolioFactory");
    const factory = await viem.getContractAt("PortfolioFactory", FACTORY_ADDRESS);

    const portfolioAddress = await factory.read.getPortfolio([user.account.address]);

    if (portfolioAddress === "0x0000000000000000000000000000000000000000") {
        console.log("❌ No portfolio found. Run create-portfolio.ts first!");
        return;
    }

    console.log(`Portfolio Address: ${portfolioAddress}\n`);

    // Get portfolio contract
    const portfolio = await viem.getContractAt("UserPortfolio", portfolioAddress);

    // Get token addresses
    const DAI_ADDRESS = await getDeployedAddress("TokensModule", "TestDAI");
    const USDC_ADDRESS = await getDeployedAddress("TokensModule", "TestUSDC");
    const WBTC_ADDRESS = await getDeployedAddress("TokensModule", "TestWBTC");

    // Define allocation: 50% DAI, 30% USDC, 20% WBTC
    const tokens = [DAI_ADDRESS, USDC_ADDRESS, WBTC_ADDRESS];
    const percents = [50, 30, 20]; // Must sum to 100

    console.log("Setting allocation:");
    console.log(`  50% DAI  (${DAI_ADDRESS})`);
    console.log(`  30% USDC (${USDC_ADDRESS})`);
    console.log(`  20% WBTC (${WBTC_ADDRESS})`);

    // Set allocation
    const txHash = await portfolio.write.setAllocation([tokens, percents]);
    const publicClient = await viem.getPublicClient();
    await publicClient.waitForTransactionReceipt({ hash: txHash });

    console.log("\n✅ Allocation set successfully!");

    // Verify allocation
    const allocation = await portfolio.read.getAllocation();
    console.log("\nCurrent Allocation:");
    for (let i = 0; i < allocation.length; i++) {
        console.log(`  ${allocation[i].percent}% - ${allocation[i].token}`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
