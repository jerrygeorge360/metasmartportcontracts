import { network } from "hardhat";
const { viem } = await network.connect();
import { getDeployedAddress } from "../08-helpers/addresses.js";

async function main() {
    const ROUTER_ADDRESS = await getDeployedAddress("DexModule", "UniswapV2Router02");
    const FACTORY_ADDRESS = await getDeployedAddress("DexModule", "UniswapV2Factory");

    const router = await viem.getContractAt("UniswapV2Router02", ROUTER_ADDRESS);

    const routerFactory = await router.read.factory();
    const routerWMON = await router.read.WMON();

    console.log("Expected Factory:", FACTORY_ADDRESS);
    console.log("Router's Factory:", routerFactory);
    console.log("Match:", routerFactory.toLowerCase() === FACTORY_ADDRESS.toLowerCase());
    console.log();
    console.log("Router's WMON:", routerWMON);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
