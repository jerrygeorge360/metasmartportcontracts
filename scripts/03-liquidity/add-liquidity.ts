import { network } from "hardhat";
const { viem } = await network.connect();
import { parseEther, formatEther, maxUint256 } from "viem";
import { getDeployedAddress } from "../08-helpers/addresses.js";

async function main() {
    const [deployer] = await viem.getWalletClients();
    const publicClient = await viem.getPublicClient();
    console.log(`Setup with account: ${deployer.account.address}`);

    // 1. Get Addresses
    const ROUTER_ADDRESS = await getDeployedAddress("DexModule", "UniswapV2Router02");
    const DAI_ADDRESS = await getDeployedAddress("TokensModule", "TestDAI");
    const WMON_ADDRESS = await getDeployedAddress("WmonModule", "WMON");

    // 2. Get Contracts
    const router = await viem.getContractAt("UniswapV2Router02", ROUTER_ADDRESS);
    const dai = await viem.getContractAt("TestDAI", DAI_ADDRESS);

    // 3. Approve Router to spend DAI
    console.log("Approving DAI...");
    const approveHash = await dai.write.approve([ROUTER_ADDRESS, maxUint256]);
    await publicClient.waitForTransactionReceipt({ hash: approveHash });
    console.log("DAI Approved.");

    // Debug: Calculate Pair Address
    const factoryAddress = await router.read.factory();
    console.log(`Factory: ${factoryAddress}`);

    // Debug: Manually create pair to verify address
    const factoryContract = await viem.getContractAt("UniswapV2Factory", factoryAddress);
    const getPairBefore = await factoryContract.read.getPair([DAI_ADDRESS, WMON_ADDRESS]);
    console.log(`Pair Before: ${getPairBefore}`);

    if (getPairBefore === "0x0000000000000000000000000000000000000000") {
        console.log("Creating Pair manually...");
        await factoryContract.write.createPair([DAI_ADDRESS, WMON_ADDRESS]);
    }

    const pairAddress = await factoryContract.read.getPair([DAI_ADDRESS, WMON_ADDRESS]);
    console.log(`Real Pair Address: ${pairAddress}`);

    // Calculate expected address (off-chain)
    const token0 = DAI_ADDRESS.toLowerCase() < WMON_ADDRESS.toLowerCase() ? DAI_ADDRESS : WMON_ADDRESS;
    const token1 = DAI_ADDRESS.toLowerCase() < WMON_ADDRESS.toLowerCase() ? WMON_ADDRESS : DAI_ADDRESS;

    const { encodePacked, keccak256 } = await import("viem");
    const salt = keccak256(encodePacked(['address', 'address'], [token0, token1]));

    // Manual CREATE2 calculation
    // keccak256(0xff ++ address ++ salt ++ keccak256(init_code))[12:]
    const rawAddress = keccak256(encodePacked(
        ['bytes1', 'address', 'bytes32', 'bytes32'],
        ['0xff', factoryAddress, salt, "0xad15591d13985e49b908b2286adf5769e46b4c3da6728051854550ca3c271623"]
    ));
    const computedAddress = "0x" + rawAddress.slice(26);
    console.log(`Computed Address: ${computedAddress}`);
    const balance = await dai.read.balanceOf([deployer.account.address]);
    console.log(`DAI Balance: ${formatEther(balance)}`);
    const allowance = await dai.read.allowance([deployer.account.address, ROUTER_ADDRESS]);
    console.log(`DAI Allowance: ${formatEther(allowance)}`);

    console.log("Adding Liquidity (1000 DAI + 1 ETH)...");
    const amountDAI = parseEther("1000");
    const amountETH = parseEther("1");
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20); // 20 mins

    const txHash = await router.write.addLiquidityMON([
        DAI_ADDRESS,        // token
        amountDAI,          // amountTokenDesired
        0n,                 // amountTokenMin (slippage 100% for test)
        0n,                 // amountMONMin (slippage 100% for test)
        deployer.account.address, // to
        deadline            // deadline
    ], {
        value: amountETH
    });

    await publicClient.waitForTransactionReceipt({ hash: txHash });
    console.log("Liquidity Added! Pool Created.");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
