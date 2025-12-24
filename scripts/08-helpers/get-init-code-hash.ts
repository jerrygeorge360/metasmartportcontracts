import { artifacts } from "hardhat";
import { keccak256 } from "viem";

async function main() {
    const artifact = await artifacts.readArtifact("UniswapV2Pair");
    const bytecode = artifact.bytecode;
    const hash = keccak256(bytecode as `0x${string}`);
    console.log(`Init Code Hash: ${hash}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
