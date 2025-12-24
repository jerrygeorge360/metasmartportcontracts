import { network } from "hardhat";
const { viem } = await network.connect();
import { parseEther, parseUnits, maxUint256 } from "viem";
import { getDeployedAddress } from "../08-helpers/addresses.js";

/**
 * Configuration for liquidity pools to create
 */
interface LiquidityPool {
    name: string;
    tokenAddress: string;
    tokenAmount: bigint;
    ethAmount: bigint;
    decimals?: number;
}

async function main() {
    const [deployer] = await viem.getWalletClients();
    const publicClient = await viem.getPublicClient();
    console.log(`Initializing DEX with account: ${deployer.account.address}\n`);

    // 1. Load contract addresses
    const addresses = await loadContractAddresses();
    await displayContractAddresses(addresses);

    // 2. Load contracts
    const contracts = await loadContracts(addresses);

    // 3. Approve tokens for router
    await approveTokens(contracts, addresses.ROUTER_ADDRESS, publicClient);

    // 4. Add liquidity to main pairs (Token/WMON)
    await addMainLiquidityPools(contracts, addresses, deployer, publicClient);

    // 5. Add stablecoin pairs (DAI/USDC, etc.)
    await addStablecoinPairs(contracts, addresses, deployer, publicClient);

    // 6. Display final summary
    await displaySummary(contracts.factory, viem);

    console.log("\nDEX initialization complete! Ready for trading!");
}

async function loadContractAddresses() {
    console.log(" Loading contract addresses...");
    
    const addresses = {
        ROUTER_ADDRESS: await getDeployedAddress("DexModule", "UniswapV2Router02"),
        FACTORY_ADDRESS: await getDeployedAddress("DexModule", "UniswapV2Factory"),
        DAI_ADDRESS: await getDeployedAddress("TokensModule", "TestDAI"),
        USDC_ADDRESS: await getDeployedAddress("TokensModule", "TestUSDC"),
        USDT_ADDRESS: await getDeployedAddress("TokensModule", "TestUSDT"),
        WBTC_ADDRESS: await getDeployedAddress("TokensModule", "TestWBTC"),
        WMON_ADDRESS: await getDeployedAddress("WmonModule", "WMON"),
    };
    
    console.log("All addresses loaded successfully\n");
    return addresses;
}

async function displayContractAddresses(addresses: any) {
    console.log("Contract Addresses:");
    console.log(`   Router:  ${addresses.ROUTER_ADDRESS}`);
    console.log(`   Factory: ${addresses.FACTORY_ADDRESS}`);
    console.log(`   WMON:    ${addresses.WMON_ADDRESS}`);
    console.log(`   DAI:     ${addresses.DAI_ADDRESS}`);
    console.log(`   USDC:    ${addresses.USDC_ADDRESS}`);
    console.log(`   USDT:    ${addresses.USDT_ADDRESS}`);
    console.log(`   WBTC:    ${addresses.WBTC_ADDRESS}\n`);
}

async function loadContracts(addresses: any) {
    console.log(" Loading contract instances...");
    
    const contracts = {
        router: await viem.getContractAt("UniswapV2Router02", addresses.ROUTER_ADDRESS),
        factory: await viem.getContractAt("UniswapV2Factory", addresses.FACTORY_ADDRESS),
        dai: await viem.getContractAt("TestDAI", addresses.DAI_ADDRESS),
        usdc: await viem.getContractAt("TestUSDC", addresses.USDC_ADDRESS),
        usdt: await viem.getContractAt("TestUSDT", addresses.USDT_ADDRESS),
        wbtc: await viem.getContractAt("TestWBTC", addresses.WBTC_ADDRESS),
    };
    
    console.log("Contract instances loaded\n");
    return contracts;
}

async function approveTokens(contracts: any, routerAddress: string, publicClient: any) {
    console.log("Approving tokens for router...");
    
    const tokens = [
        { name: "DAI", contract: contracts.dai },
        { name: "USDC", contract: contracts.usdc },
        { name: "USDT", contract: contracts.usdt },
        { name: "WBTC", contract: contracts.wbtc }
    ];

    for (const token of tokens) {
        console.log(`   Approving ${token.name}...`);
        const hash = await token.contract.write.approve([routerAddress, maxUint256]);
        await publicClient.waitForTransactionReceipt({ hash });
    }
    console.log(" All tokens approved for router\n");
}

async function addMainLiquidityPools(contracts: any, addresses: any, deployer: any, publicClient: any) {
    console.log(" Adding liquidity to main pools (Token/WMON)...\n");
    
    const liquidityPools: LiquidityPool[] = [
        {
            name: "DAI/WMON",
            tokenAddress: addresses.DAI_ADDRESS,
            tokenAmount: parseEther("10000"),    // 10,000 DAI
            ethAmount: parseEther("10"),          // 10 ETH
        },
        {
            name: "USDC/WMON", 
            tokenAddress: addresses.USDC_ADDRESS,
            tokenAmount: parseUnits("10000", 6), // 10,000 USDC (6 decimals)
            ethAmount: parseEther("10"),          // 10 ETH
        },
        {
            name: "USDT/WMON",
            tokenAddress: addresses.USDT_ADDRESS,
            tokenAmount: parseUnits("10000", 6), // 10,000 USDT (6 decimals)
            ethAmount: parseEther("10"),          // 10 ETH
        },
        {
            name: "WBTC/WMON",
            tokenAddress: addresses.WBTC_ADDRESS,
            tokenAmount: parseUnits("1", 8),     // 1 WBTC (8 decimals)
            ethAmount: parseEther("50"),          // 50 ETH (WBTC is more valuable)
        }
    ];

    const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20); // 20 mins

    for (const pool of liquidityPools) {
        console.log(`   Adding liquidity to ${pool.name}...`);

        try {
            const txHash = await contracts.router.write.addLiquidityMON([
                pool.tokenAddress,
                pool.tokenAmount,
                0n, // amountTokenMin (0 for initial liquidity)
                0n, // amountMONMin (0 for initial liquidity)
                deployer.account.address,
                deadline
            ], {
                value: pool.ethAmount
            });

            await publicClient.waitForTransactionReceipt({ hash: txHash });

            // Get pair address
            const pairAddress = await contracts.factory.read.getPair([pool.tokenAddress, addresses.WMON_ADDRESS]);
            console.log(`    ${pool.name} pool created: ${pairAddress}\n`);
        } catch (error: any) {
            console.log(`    Failed to create ${pool.name} pool: ${error.message}\n`);
        }
    }
}

async function addStablecoinPairs(contracts: any, addresses: any, deployer: any, publicClient: any) {
    console.log("Adding stablecoin pairs...\n");
    
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20);
    
    console.log("   Adding liquidity to DAI/USDC...");

    try {
        const txHash = await contracts.router.write.addLiquidity([
            addresses.DAI_ADDRESS,
            addresses.USDC_ADDRESS,
            parseEther("5000"),      // 5,000 DAI
            parseUnits("5000", 6),   // 5,000 USDC
            0n,
            0n,
            deployer.account.address,
            deadline
        ]);

        await publicClient.waitForTransactionReceipt({ hash: txHash });

        const pairAddress = await contracts.factory.read.getPair([addresses.DAI_ADDRESS, addresses.USDC_ADDRESS]);
        console.log(`    DAI/USDC pool created: ${pairAddress}\n`);
    } catch (error: any) {
        console.log(`    Failed to create DAI/USDC pool: ${error.message}\n`);
    }
}

async function displaySummary(factory: any, viem: any) {
    console.log("Summary:");

    const totalPairs = await factory.read.allPairsLength();
    console.log(` Total pairs created: ${totalPairs}`);

    console.log("\nAll pairs:");
    for (let i = 0n; i < totalPairs; i++) {
        const pairAddress = await factory.read.allPairs([i]);
        const pair = await viem.getContractAt("UniswapV2Pair", pairAddress);
        const token0 = await pair.read.token0();
        const token1 = await pair.read.token1();
        console.log(`   ${i + 1n}. ${pairAddress.slice(0, 10)}... (${token0.slice(0, 8)}.../${token1.slice(0, 8)}...)`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
