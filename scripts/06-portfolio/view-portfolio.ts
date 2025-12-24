import { network } from "hardhat";
const { viem } = await network.connect();
import { parseEther, formatEther } from "viem";
import { getDeployedAddress } from "../08-helpers/addresses.js";

async function main() {
    const [user] = await viem.getWalletClients();
    const publicClient = await viem.getPublicClient();

    console.log(`Querying portfolio for: ${user.account.address}\n`);

    // Get portfolio address
    const FACTORY_ADDRESS = await getDeployedAddress("PortfolioModule", "PortfolioFactory");
    const factory = await viem.getContractAt("PortfolioFactory", FACTORY_ADDRESS);

    const portfolioAddress = await factory.read.getPortfolio([user.account.address]);

    if (portfolioAddress === "0x0000000000000000000000000000000000000000") {
        console.log(" No portfolio found for this user");
        return;
    }

    console.log(`Portfolio Address: ${portfolioAddress}\n`);

    // Get portfolio contract
    const portfolio = await viem.getContractAt("UserPortfolio", portfolioAddress);

    // Get basic info
    const owner = await portfolio.read.owner();
    const paused = await portfolio.read.paused();
    const hasAllocation = await portfolio.read.hasAllocation();

    console.log("=== Portfolio Info ===");
    console.log(`Owner: ${owner}`);
    console.log(`Paused: ${paused}`);
    console.log(`Has Valid Allocation: ${hasAllocation}`);

    // Get allocation
    const allocation = await portfolio.read.getAllocation();

    if (allocation.length > 0) {
        console.log("\n=== Allocation ===");
        let total = 0;
        for (let i = 0; i < allocation.length; i++) {
            console.log(`  ${allocation[i].percent}% - ${allocation[i].token}`);
            total += Number(allocation[i].percent);
        }
        console.log(`Total: ${total}%`);

        // Get balances for allocated tokens
        console.log("\n=== Token Balances in Portfolio ===");
        for (let i = 0; i < allocation.length; i++) {
            const balance = await portfolio.read.getContractBalance([allocation[i].token]);
            console.log(`  ${allocation[i].token}: ${formatEther(balance)}`);
        }
    } else {
        console.log("\n⚠️  No allocation set");
    }

    // Get common token balances
    console.log("\n=== Common Token Balances ===");
    try {
        const DAI_ADDRESS = await getDeployedAddress("TokensModule", "TestDAI");
        const USDC_ADDRESS = await getDeployedAddress("TokensModule", "TestUSDC");
        const WMON_ADDRESS = await getDeployedAddress("WmonModule", "WMON");

        const daiBalance = await portfolio.read.getContractBalance([DAI_ADDRESS]);
        const usdcBalance = await portfolio.read.getContractBalance([USDC_ADDRESS]);
        const wmonBalance = await portfolio.read.getContractBalance([WMON_ADDRESS]);

        console.log(`  DAI:  ${formatEther(daiBalance)}`);
        console.log(`  USDC: ${formatEther(usdcBalance)}`);
        console.log(`  WMON: ${formatEther(wmonBalance)}`);
    } catch (error) {
        console.log("  (Tokens not deployed)");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
