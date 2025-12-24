import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import DexModule from "./Dex.js";

const PortfolioModule = buildModule("PortfolioModule", (m) => {
    // Get the Router from DexModule
    const { router } = m.useModule(DexModule);

    // Deploy PortfolioFactory with the router address
    const portfolioFactory = m.contract("PortfolioFactory", [router]);

    return { portfolioFactory };
});

export default PortfolioModule;
