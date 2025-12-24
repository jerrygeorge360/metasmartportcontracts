import { network } from "hardhat";
const { viem } = await network.connect();
import { parseEther, formatEther, maxUint256 } from "viem";
import { getDeployedAddress } from "../08-helpers/addresses.js";

async function main() {
    const [deployer] = await viem.getWalletClients();
    const publicClient = await viem.getPublicClient();
    console.log(`Removing liquidity with account: ${deployer.account.address}`);

    // 1. Get Addresses
    const ROUTER_ADDRESS = await getDeployedAddress("DexModule", "UniswapV2Router02");
    const FACTORY_ADDRESS = await getDeployedAddress("DexModule", "UniswapV2Factory");
    const DAI_ADDRESS = await getDeployedAddress("TokensModule", "TestDAI");
    const WMON_ADDRESS = await getDeployedAddress("WmonModule", "WMON");

    // 2. Get Contracts
    const router = await viem.getContractAt("UniswapV2Router02", ROUTER_ADDRESS);
    const factory = await viem.getContractAt("UniswapV2Factory", FACTORY_ADDRESS);

    // 3. Get Pair Address
    const pairAddress = await factory.read.getPair([DAI_ADDRESS, WMON_ADDRESS]);
    console.log(`Pair Address: ${pairAddress}`);

    if (pairAddress === "0x0000000000000000000000000000000000000000") {
        console.log("Pair does not exist!");
        return;
    }

    const pair = await viem.getContractAt("UniswapV2Pair", pairAddress);

    // 4. Check LP Token Balance
    const lpBalance = await pair.read.balanceOf([deployer.account.address]);
    console.log(`LP Token Balance: ${formatEther(lpBalance)}`);

    if (lpBalance === 0n) {
        console.log("No LP tokens to remove!");
        return;
    }

    // 5. Get Current Reserves
    const reserves = await pair.read.getReserves();
    console.log(`Current Reserves - Reserve0: ${formatEther(reserves[0])}, Reserve1: ${formatEther(reserves[1])}`);

    // 6. Approve Router to spend LP tokens
    console.log("Approving LP tokens...");
    const approveHash = await pair.write.approve([ROUTER_ADDRESS, maxUint256]);
    await publicClient.waitForTransactionReceipt({ hash: approveHash });
    console.log("LP tokens approved.");

    // 7. Remove 50% of liquidity
    const liquidityToRemove = lpBalance / 2n;
    console.log(`Removing ${formatEther(liquidityToRemove)} LP tokens (50% of balance)...`);

    const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20); // 20 mins

    const txHash = await router.write.removeLiquidityMON([
        DAI_ADDRESS,        // token
        liquidityToRemove,  // liquidity
        0n,                 // amountTokenMin (slippage 100% for test)
        0n,                 // amountMONMin (slippage 100% for test)
        deployer.account.address, // to
        deadline            // deadline
    ]);

    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
    console.log("Liquidity Removed!");

    // 8. Check Updated Balances
    const newLpBalance = await pair.read.balanceOf([deployer.account.address]);
    const newReserves = await pair.read.getReserves();

    console.log(`\nUpdated LP Token Balance: ${formatEther(newLpBalance)}`);
    console.log(`Updated Reserves - Reserve0: ${formatEther(newReserves[0])}, Reserve1: ${formatEther(newReserves[1])}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
