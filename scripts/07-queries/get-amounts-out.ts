import { network } from "hardhat";
const { viem } = await network.connect();
import { parseEther, formatEther } from "viem";
import { getDeployedAddress } from "../08-helpers/addresses.js";

async function main() {
    const [deployer] = await viem.getWalletClients();
    console.log(`Calculating swap amounts with account: ${deployer.account.address}`);

    // 1. Get Addresses
    const ROUTER_ADDRESS = await getDeployedAddress("DexModule", "UniswapV2Router02");
    const DAI_ADDRESS = await getDeployedAddress("TokensModule", "TestDAI");
    const WMON_ADDRESS = await getDeployedAddress("WmonModule", "WMON");

    // 2. Get Router Contract
    const router = await viem.getContractAt("UniswapV2Router02", ROUTER_ADDRESS);

    // 3. Define swap amounts to test
    const testAmounts = [
        parseEther("1"),
        parseEther("10"),
        parseEther("100"),
        parseEther("1000")
    ];

    console.log(`\n=== DAI -> WMON Swap Quotes ===`);
    for (const amount of testAmounts) {
        try {
            // Get amounts out for DAI -> WMON
            const amountsOut = await router.read.getAmountsOut([
                amount,
                [DAI_ADDRESS, WMON_ADDRESS]
            ]);

            const inputAmount = formatEther(amountsOut[0]);
            const outputAmount = formatEther(amountsOut[1]);
            const rate = Number(outputAmount) / Number(inputAmount);

            console.log(`\nInput: ${inputAmount} DAI`);
            console.log(`Output: ${outputAmount} WMON`);
            console.log(`Rate: 1 DAI = ${rate.toFixed(6)} WMON`);
            console.log(`Price Impact: ${((1 - rate) * 100).toFixed(4)}%`);
        } catch (error: any) {
            console.log(`\nInput: ${formatEther(amount)} DAI`);
            console.log(`Error: ${error.message || 'Insufficient liquidity'}`);
        }
    }

    console.log(`\n=== WMON -> DAI Swap Quotes ===`);
    for (const amount of testAmounts) {
        try {
            // Get amounts out for WMON -> DAI
            const amountsOut = await router.read.getAmountsOut([
                amount,
                [WMON_ADDRESS, DAI_ADDRESS]
            ]);

            const inputAmount = formatEther(amountsOut[0]);
            const outputAmount = formatEther(amountsOut[1]);
            const rate = Number(outputAmount) / Number(inputAmount);

            console.log(`\nInput: ${inputAmount} WMON`);
            console.log(`Output: ${outputAmount} DAI`);
            console.log(`Rate: 1 WMON = ${rate.toFixed(6)} DAI`);
            console.log(`Price Impact: ${((1 - rate) * 100).toFixed(4)}%`);
        } catch (error: any) {
            console.log(`\nInput: ${formatEther(amount)} WMON`);
            console.log(`Error: ${error.message || 'Insufficient liquidity'}`);
        }
    }

    // 4. Test multi-hop swap (if more pairs exist)
    console.log(`\n=== Testing Multi-Hop Capability ===`);
    try {
        const USDC_ADDRESS = await getDeployedAddress("TokensModule", "TestUSDC");

        // Try DAI -> WMON -> USDC (will fail if USDC/WMON pair doesn't exist)
        const multiHopAmounts = await router.read.getAmountsOut([
            parseEther("10"),
            [DAI_ADDRESS, WMON_ADDRESS, USDC_ADDRESS]
        ]);

        console.log(`Multi-hop swap (DAI -> WMON -> USDC):`);
        console.log(`  Input: ${formatEther(multiHopAmounts[0])} DAI`);
        console.log(`  Via: ${formatEther(multiHopAmounts[1])} WMON`);
        console.log(`  Output: ${formatEther(multiHopAmounts[2])} USDC`);
    } catch (error: any) {
        console.log(`Multi-hop swap not available (pairs may not exist)`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
