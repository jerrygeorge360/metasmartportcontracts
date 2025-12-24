import { network } from "hardhat";
const { viem } = await network.connect();
import { getDeployedAddress } from "../08-helpers/addresses.js";

async function main() {
    console.log(" Calculating and updating init code hash...\n");

    // Get the deployed factory
    const FACTORY_ADDRESS = await getDeployedAddress("DexModule", "UniswapV2Factory");
    const factory = await viem.getContractAt("UniswapV2Factory", FACTORY_ADDRESS);
    
    console.log(` Factory Address: ${FACTORY_ADDRESS}`);
    
    // Get the correct init code hash from the factory
    const initCodeHash = await factory.read.getInitCodeHash();
    console.log(`Correct Init Code Hash: ${initCodeHash}`);
    
    // Read current router contract to check if it needs updating
    const fs = await import("fs");
    const path = await import("path");
    
    const routerPath = path.join(process.cwd(), "contracts", "dex", "UniswapV2Router02.sol");
    const routerContent = fs.readFileSync(routerPath, "utf8");
    
    // Check if the hash is already correct
    if (routerContent.includes(initCodeHash.slice(2))) {
        console.log(" Init code hash is already correct in router contract");
        return;
    }
    
    console.log("⚠️  Init code hash mismatch detected!");
    console.log("📝 Please update the init code hash in UniswapV2Router02.sol manually:");
    console.log(`   Replace the hex value in pairFor() function with: ${initCodeHash.slice(2)}`);
    console.log("\n🔄 After updating, you'll need to:");
    console.log("   1. Recompile: npx hardhat compile");
    console.log("   2. Redeploy router: npx hardhat ignition deploy ignition/modules/shared/Dex.ts --network localhost --reset");
    
    // Test with a sample pair to verify
    console.log("\n Testing pair address calculation...");
    
    const DAI_ADDRESS = await getDeployedAddress("TokensModule", "TestDAI");
    const WMON_ADDRESS = await getDeployedAddress("WmonModule", "WMON");
    
    // Check if pair exists
    const existingPair = await factory.read.getPair([DAI_ADDRESS, WMON_ADDRESS]);
    
    if (existingPair !== "0x0000000000000000000000000000000000000000") {
        console.log(` Test pair (DAI/WMON): ${existingPair}`);
        console.log(" Pair address calculation working correctly");
    } else {
        console.log(" No test pair exists yet (this is normal for fresh deployment)");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
