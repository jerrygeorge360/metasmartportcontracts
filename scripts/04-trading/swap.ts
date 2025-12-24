import { network } from "hardhat";
const { viem } = await network.connect();
import { parseEther, formatEther, maxUint256 } from "viem";
import { getDeployedAddress } from "../08-helpers/addresses.js";

async function main() {
    const [deployer] = await viem.getWalletClients();
    const publicClient = await viem.getPublicClient();
    console.log(`Swapping with account: ${deployer.account.address}`);

    // 1. Get Addresses
    const ROUTER_ADDRESS = await getDeployedAddress("DexModule", "UniswapV2Router02");
    const DAI_ADDRESS = await getDeployedAddress("TokensModule", "TestDAI");
    const WMON_ADDRESS = await getDeployedAddress("WmonModule", "WMON");

    // 2. Get Contracts
    const router = await viem.getContractAt("UniswapV2Router02", ROUTER_ADDRESS);
    const dai = await viem.getContractAt("TestDAI", DAI_ADDRESS);

    // 3. Check Initial Balance
    const initialEth = await publicClient.getBalance({ address: deployer.account.address });
    console.log(`Initial ETH: ${formatEther(initialEth)}`);

    // 4. Swap 10 DAI for ETH
    console.log("Swapping 10 DAI for ETH...");
    const amountIn = parseEther("10");
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20); // 20 mins

    // Ensure approval (in case it wasn't done or was reset)
    await dai.write.approve([ROUTER_ADDRESS, maxUint256]);

    const txHash = await router.write.swapExactTokensForMON([
        amountIn,           // amountIn
        0n,                 // amountOutMin
        [DAI_ADDRESS, WMON_ADDRESS], // path (DAI -> WMON)
        deployer.account.address,    // to
        deadline            // deadline
    ]);

    await publicClient.waitForTransactionReceipt({ hash: txHash });
    console.log("Swap Complete!");

    // 5. Check Final Balance
    const finalEth = await publicClient.getBalance({ address: deployer.account.address });
    console.log(`Final ETH: ${formatEther(finalEth)}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
