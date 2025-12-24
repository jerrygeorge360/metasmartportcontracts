import { network } from "hardhat";
const { viem } = await network.connect();
import { getDeployedAddress } from "../08-helpers/addresses.js";

async function main() {
    const [user] = await viem.getWalletClients();
    const publicClient = await viem.getPublicClient();

    console.log(`Creating portfolio for: ${user.account.address}\n`);

    // Get PortfolioFactory address
    const FACTORY_ADDRESS = await getDeployedAddress("PortfolioModule", "PortfolioFactory");
    console.log(`Factory Address: ${FACTORY_ADDRESS}`);

    // Get factory contract
    const factory = await viem.getContractAt("PortfolioFactory", FACTORY_ADDRESS);

    // Check if portfolio already exists
    const existingPortfolio = await factory.read.getPortfolio([user.account.address]);

    if (existingPortfolio !== "0x0000000000000000000000000000000000000000") {
        console.log(`\n✅ Portfolio already exists at: ${existingPortfolio}`);
        return;
    }

    // Create portfolio
    console.log("\nCreating portfolio...");
    const txHash = await factory.write.createPortfolio();
    await publicClient.waitForTransactionReceipt({ hash: txHash });

    // Get the created portfolio address
    const portfolioAddress = await factory.read.getPortfolio([user.account.address]);

    console.log(`\n✅ Portfolio created successfully!`);
    console.log(`Portfolio Address: ${portfolioAddress}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
