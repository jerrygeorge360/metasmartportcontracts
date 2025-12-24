import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import WmonModule from "./Wmon.js";

export default buildModule("DexModule", (m) => {
    const { wmon } = m.useModule(WmonModule);

    // 1. Deploy Factory
    // feeToSetter is set to the deployer account (m.getAccount(0))
    const deployer = m.getAccount(0);
    const factory = m.contract("UniswapV2Factory", [deployer]);

    // 2. Deploy Router
    // Router needs (Factory, WETH/WMON)
    const router = m.contract("UniswapV2Router02", [factory, wmon]);

    return { factory, router };
});
