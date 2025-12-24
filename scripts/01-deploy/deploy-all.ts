import { network } from "hardhat";
const { viem } = await network.connect();

async function main() {
    const [deployer] = await viem.getWalletClients();
    console.log(`Deploying all contracts with account: ${deployer.account.address}\n`);

    console.log("Initial ETH Balance:", await viem.getPublicClient().then(client => 
        client.getBalance({ address: deployer.account.address })
    ).then(balance => `${Number(balance) / 1e18} ETH`));

    // Step 1: Deploy Core Contracts (WMON)
    console.log("\n===  Deploying WMON ===");
    const { execSync } = await import("child_process");
    
    try {
        execSync("npx hardhat ignition deploy ignition/modules/shared/Wmon.ts --network localhost", { 
            stdio: "inherit", 
            cwd: process.cwd() 
        });
        console.log(" WMON deployed successfully");
    } catch (error) {
        console.error(" WMON deployment failed:", error);
        process.exit(1);
    }

    // Step 2: Deploy DEX Contracts (Factory & Router)
    console.log("\n=== Deploying DEX (Factory & Router) ===");
    
    try {
        execSync("npx hardhat ignition deploy ignition/modules/shared/Dex.ts --network localhost", { 
            stdio: "inherit", 
            cwd: process.cwd() 
        });
        console.log("✅ DEX deployed successfully");
    } catch (error) {
        console.error(" DEX deployment failed:", error);
        process.exit(1);
    }

    // Step 3: Deploy Test Tokens
    console.log("\n=== Deploying Test Tokens ===");
    
    try {
        execSync("npx hardhat ignition deploy ignition/modules/shared/Tokens.ts --network localhost", { 
            stdio: "inherit", 
            cwd: process.cwd() 
        });
        console.log(" Test tokens deployed successfully");
    } catch (error) {
        console.error(" Test tokens deployment failed:", error);
        process.exit(1);
    }

    // Step 4: Deploy Portfolio Contracts
    console.log("\n===  Deploying Portfolio Factory ===");
    
    try {
        execSync("npx hardhat ignition deploy ignition/modules/shared/Portfolio.ts --network localhost", { 
            stdio: "inherit", 
            cwd: process.cwd() 
        });
        console.log("✅ Portfolio factory deployed successfully");
    } catch (error) {
        console.error(" Portfolio factory deployment failed:", error);
        process.exit(1);
    }

    console.log("\n All contracts deployed successfully!");
    console.log("\n Next steps:");
    console.log("   1. Run: npm run setup:init-code-hash");
    console.log("   2. Run: npm run setup:initialize-dex");
    console.log("   3. Run: npm run liquidity:add-initial");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
