import { network } from "hardhat";
const { viem } = await network.connect();

async function main() {
    const [deployer] = await viem.getWalletClients();
    console.log("Starting complete DEX setup workflow...");
    console.log(` Account: ${deployer.account.address}\n`);

    const { execSync } = await import("child_process");
    const startTime = Date.now();

    try {
        // Step 1: Deploy all contracts
        console.log("=".repeat(60));
        console.log("STEP 1: Deploying all contracts");
        console.log("=".repeat(60));
        
        execSync("npx hardhat run scripts/01-deploy/deploy-all.ts --network localhost", {
            stdio: "inherit",
            cwd: process.cwd()
        });

        // Step 2: Calculate and verify init code hash
        console.log("\n" + "=".repeat(60));
        console.log(" STEP 2: Calculating init code hash");
        console.log("=".repeat(60));
        
        execSync("npx hardhat run scripts/02-setup/calculate-init-hash.ts --network localhost", {
            stdio: "inherit",
            cwd: process.cwd()
        });

        // Step 3: Initialize DEX with liquidity
        console.log("\n" + "=".repeat(60));
        console.log("STEP 3: Initializing DEX with liquidity");
        console.log("=".repeat(60));
        
        execSync("npx hardhat run scripts/02-setup/initialize-dex.ts --network localhost", {
            stdio: "inherit", 
            cwd: process.cwd()
        });

        // Step 4: Verify setup
        console.log("\n" + "=".repeat(60));
        console.log("STEP 4: Verifying setup");
        console.log("=".repeat(60));
        
        execSync("npx hardhat run scripts/07-queries/get-reserves.ts --network localhost", {
            stdio: "inherit",
            cwd: process.cwd()
        });

        // Success summary
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        
        console.log("\n" + "-".repeat(20));
        console.log("COMPLETE SETUP SUCCESSFUL!");
        console.log("-".repeat(20));
        console.log(`  Total time: ${duration} seconds`);

        console.log("\nWhat's available now:");
        console.log("    DEX with multiple trading pairs");
        console.log("     Liquidity pools with initial funds");
        console.log("     All tokens approved for trading");
        console.log("     Portfolio factory ready");

        console.log("\nReady to use:");
        console.log("    Trading: npm run trade:swap");
        console.log("    Portfolio: npm run portfolio:create");
        console.log("    Queries: npm run query:reserves");
        
    } catch (error: any) {
        console.error("\n Setup failed at step:", error.message);
        console.error(" Check the error above and run individual scripts to debug");
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
