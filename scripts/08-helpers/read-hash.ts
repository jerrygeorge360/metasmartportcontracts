import { network } from "hardhat";
const { viem } = await network.connect();

async function main() {
    const hashCalculator = await viem.deployContract("HashCalculator");
    const hash = await hashCalculator.read.getInitCodeHash();
    console.log(`On-Chain Init Code Hash: ${hash}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
