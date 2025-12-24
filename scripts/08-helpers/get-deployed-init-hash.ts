import { network } from "hardhat";
const { viem } = await network.connect();
import { keccak256 } from "viem";
import { getDeployedAddress } from "./addresses.js";

async function main() {
    // Get the deployed factory
    const FACTORY_ADDRESS = await getDeployedAddress("DexModule", "UniswapV2Factory");
    const factory = await viem.getContractAt("UniswapV2Factory", FACTORY_ADDRESS);
    
    console.log(`Factory Address: ${FACTORY_ADDRESS}`);
    
    // Get the init code hash from the factory
    const initCodeHash = await factory.read.getInitCodeHash();
    console.log(`Factory's getInitCodeHash(): ${initCodeHash}`);
    
    // Also try to get it by creating a test pair and checking the bytecode
    const DAI_ADDRESS = await getDeployedAddress("TokensModule", "TestDAI");
    const WMON_ADDRESS = await getDeployedAddress("WmonModule", "WMON");
    
    console.log(`\nTest tokens:`);
    console.log(`DAI: ${DAI_ADDRESS}`);
    console.log(`WMON: ${WMON_ADDRESS}`);
    
    // Check if pair exists
    const existingPair = await factory.read.getPair([DAI_ADDRESS, WMON_ADDRESS]);
    console.log(`\nExisting pair: ${existingPair}`);
    
    if (existingPair !== "0x0000000000000000000000000000000000000000") {
        const publicClient = await viem.getPublicClient();
        const pairBytecode = await publicClient.getBytecode({
            address: existingPair as `0x${string}`
        });
        console.log(`\nDeployed pair bytecode exists: ${pairBytecode !== undefined}`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
