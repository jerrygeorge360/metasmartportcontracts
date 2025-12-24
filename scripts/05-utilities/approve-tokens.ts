import { network } from "hardhat";
const { viem } = await network.connect();
import { parseEther, parseUnits, formatEther, maxUint256 } from "viem";
import { getDeployedAddress } from "../08-helpers/addresses.js";

async function main() {
    const [deployer] = await viem.getWalletClients();
    const publicClient = await viem.getPublicClient();
    console.log(`Managing token approvals with account: ${deployer.account.address}\n`);

    // Get contract addresses
    const ROUTER_ADDRESS = await getDeployedAddress("DexModule", "UniswapV2Router02");
    const DAI_ADDRESS = await getDeployedAddress("TokensModule", "TestDAI");
    const USDC_ADDRESS = await getDeployedAddress("TokensModule", "TestUSDC");
    const USDT_ADDRESS = await getDeployedAddress("TokensModule", "TestUSDT");
    const WBTC_ADDRESS = await getDeployedAddress("TokensModule", "TestWBTC");
    const WMON_ADDRESS = await getDeployedAddress("WmonModule", "WMON");

    console.log("=== Contract Addresses ===");
    console.log(`Router: ${ROUTER_ADDRESS}`);
    console.log(`WMON: ${WMON_ADDRESS}`);
    console.log(`DAI: ${DAI_ADDRESS}`);
    console.log(`USDC: ${USDC_ADDRESS}`);
    console.log(`USDT: ${USDT_ADDRESS}`);
    console.log(`WBTC: ${WBTC_ADDRESS}\n`);

    // Get contracts
    const dai = await viem.getContractAt("TestDAI", DAI_ADDRESS);
    const usdc = await viem.getContractAt("TestUSDC", USDC_ADDRESS);
    const usdt = await viem.getContractAt("TestUSDT", USDT_ADDRESS);
    const wbtc = await viem.getContractAt("TestWBTC", WBTC_ADDRESS);
    const wmon = await viem.getContractAt("WMON", WMON_ADDRESS);

    const tokens = [
        { name: "DAI", contract: dai, address: DAI_ADDRESS },
        { name: "USDC", contract: usdc, address: USDC_ADDRESS },
        { name: "USDT", contract: usdt, address: USDT_ADDRESS },
        { name: "WBTC", contract: wbtc, address: WBTC_ADDRESS },
        { name: "WMON", contract: wmon, address: WMON_ADDRESS }
    ];

    // Check current allowances
    console.log("=== Current Allowances for Router ===");
    for (const token of tokens) {
        const allowance = await token.contract.read.allowance([deployer.account.address, ROUTER_ADDRESS]);
        console.log(`${token.name}: ${formatEther(allowance)}`);
    }

    // Approve all tokens for Router
    console.log("\n=== Approving Tokens for Router ===");
    for (const token of tokens) {
        console.log(`Approving ${token.name} for maximum allowance...`);
        const hash = await token.contract.write.approve([ROUTER_ADDRESS, maxUint256]);
        await publicClient.waitForTransactionReceipt({ hash });
        console.log(` ${token.name} approved`);
    }

    // Verify approvals
    console.log("\n=== Verified Allowances ===");
    for (const token of tokens) {
        const allowance = await token.contract.read.allowance([deployer.account.address, ROUTER_ADDRESS]);
        const isMax = allowance === maxUint256;
        console.log(`${token.name}: ${isMax ? "MAX (unlimited)" : formatEther(allowance)}`);
    }

    console.log("\nAll tokens approved for trading!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
