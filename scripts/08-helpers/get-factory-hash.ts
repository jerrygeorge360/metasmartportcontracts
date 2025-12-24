import { network } from "hardhat";
const { viem } = await network.connect();
import { getDeployedAddress } from "../08-helpers/addresses.js";

async function main() {
    const factoryAddress = await getDeployedAddress("DexModule", "UniswapV2Factory");
    const factory = await viem.getContractAt("UniswapV2Factory", factoryAddress);
    const hash = await factory.read.getInitCodeHash();
    console.log(`Factory Init Code Hash: ${hash}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
