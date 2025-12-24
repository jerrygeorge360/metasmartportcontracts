import { network } from "hardhat";
const { viem } = await network.connect();
import { getDeployedAddress } from "../08-helpers/addresses.js";

async function main() {
    const [deployer] = await viem.getWalletClients();
    console.log(`Querying pairs with account: ${deployer.account.address}\n`);

    // 1. Get Addresses
    const FACTORY_ADDRESS = await getDeployedAddress("DexModule", "UniswapV2Factory");
    const DAI_ADDRESS = await getDeployedAddress("TokensModule", "TestDAI");
    const USDC_ADDRESS = await getDeployedAddress("TokensModule", "TestUSDC");
    const USDT_ADDRESS = await getDeployedAddress("TokensModule", "TestUSDT");
    const WBTC_ADDRESS = await getDeployedAddress("TokensModule", "TestWBTC");
    const WMON_ADDRESS = await getDeployedAddress("WmonModule", "WMON");

    // 2. Get Factory Contract
    const factory = await viem.getContractAt("UniswapV2Factory", FACTORY_ADDRESS);

    console.log(`Factory Address: ${FACTORY_ADDRESS}\n`);

    // 3. Check all possible pairs
    const tokens = [
        { name: "DAI", address: DAI_ADDRESS },
        { name: "USDC", address: USDC_ADDRESS },
        { name: "USDT", address: USDT_ADDRESS },
        { name: "WBTC", address: WBTC_ADDRESS },
        { name: "WMON", address: WMON_ADDRESS }
    ];

    console.log("=== Checking All Possible Pairs ===\n");

    const existingPairs = [];

    for (let i = 0; i < tokens.length; i++) {
        for (let j = i + 1; j < tokens.length; j++) {
            const token0 = tokens[i];
            const token1 = tokens[j];

            const pairAddress = await factory.read.getPair([token0.address, token1.address]);

            if (pairAddress !== "0x0000000000000000000000000000000000000000") {
                console.log(`${token0.name}/${token1.name}: ${pairAddress}`);
                existingPairs.push({
                    token0: token0.name,
                    token1: token1.name,
                    address: pairAddress
                });
            } else {
                console.log(`${token0.name}/${token1.name}: Does not exist`);
            }
        }
    }

    // 4. Get total number of pairs
    const allPairsLength = await factory.read.allPairsLength();
    console.log(`\n=== Factory Statistics ===`);
    console.log(`Total Pairs Created: ${allPairsLength}`);

    // 5. List all pairs by index
    if (allPairsLength > 0n) {
        console.log(`\n=== All Pairs (by index) ===`);
        for (let i = 0n; i < allPairsLength; i++) {
            const pairAddress = await factory.read.allPairs([i]);
            console.log(`Pair ${i}: ${pairAddress}`);
        }
    }

    // 6. Show existing pairs with details
    if (existingPairs.length > 0) {
        console.log(`\n=== Existing Pairs Summary ===`);
        for (const pair of existingPairs) {
            console.log(`${pair.token0}/${pair.token1} → ${pair.address}`);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
