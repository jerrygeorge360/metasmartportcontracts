import { network } from "hardhat";
const { viem } = await network.connect();
import { formatEther } from "viem";
import { getDeployedAddress } from "../08-helpers/addresses.js";

async function main() {
    const [deployer] = await viem.getWalletClients();
    console.log(`Querying reserves with account: ${deployer.account.address}`);

    // 1. Get Addresses
    const FACTORY_ADDRESS = await getDeployedAddress("DexModule", "UniswapV2Factory");
    const DAI_ADDRESS = await getDeployedAddress("TokensModule", "TestDAI");
    const WMON_ADDRESS = await getDeployedAddress("WmonModule", "WMON");

    // 2. Get Contracts
    const factory = await viem.getContractAt("UniswapV2Factory", FACTORY_ADDRESS);
    const dai = await viem.getContractAt("TestDAI", DAI_ADDRESS);
    const wmon = await viem.getContractAt("WMON", WMON_ADDRESS);

    // 3. Get Pair Address
    const pairAddress = await factory.read.getPair([DAI_ADDRESS, WMON_ADDRESS]);
    console.log(`\nPair Address: ${pairAddress}`);

    if (pairAddress === "0x0000000000000000000000000000000000000000") {
        console.log("Pair does not exist!");
        return;
    }

    const pair = await viem.getContractAt("UniswapV2Pair", pairAddress);

    // 4. Get Token Info
    const token0 = await pair.read.token0();
    const token1 = await pair.read.token1();

    const token0Symbol = token0.toLowerCase() === DAI_ADDRESS.toLowerCase() ? "DAI" : "WMON";
    const token1Symbol = token1.toLowerCase() === DAI_ADDRESS.toLowerCase() ? "DAI" : "WMON";

    console.log(`Token0: ${token0} (${token0Symbol})`);
    console.log(`Token1: ${token1} (${token1Symbol})`);

    // 5. Get Reserves
    const reserves = await pair.read.getReserves();
    const reserve0 = reserves[0];
    const reserve1 = reserves[1];
    const blockTimestampLast = reserves[2];

    console.log(`\nReserves:`);
    console.log(`  ${token0Symbol}: ${formatEther(reserve0)}`);
    console.log(`  ${token1Symbol}: ${formatEther(reserve1)}`);
    console.log(`  Last Update: ${new Date(Number(blockTimestampLast) * 1000).toISOString()}`);

    // 6. Get Total Supply
    const totalSupply = await pair.read.totalSupply();
    console.log(`\nTotal LP Supply: ${formatEther(totalSupply)}`);

    // 7. Get User LP Balance
    const userLpBalance = await pair.read.balanceOf([deployer.account.address]);
    console.log(`Your LP Balance: ${formatEther(userLpBalance)}`);

    if (userLpBalance > 0n) {
        const sharePercentage = (Number(userLpBalance) / Number(totalSupply)) * 100;
        console.log(`Your Pool Share: ${sharePercentage.toFixed(4)}%`);
    }

    // 8. Calculate Price
    if (reserve0 > 0n && reserve1 > 0n) {
        const price0 = Number(reserve1) / Number(reserve0);
        const price1 = Number(reserve0) / Number(reserve1);

        console.log(`\nPrices:`);
        console.log(`  1 ${token0Symbol} = ${price0.toFixed(6)} ${token1Symbol}`);
        console.log(`  1 ${token1Symbol} = ${price1.toFixed(6)} ${token0Symbol}`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
