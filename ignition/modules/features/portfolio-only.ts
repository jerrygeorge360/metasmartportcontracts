import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import PortfolioModule from "../shared/Portfolio.js";

/**
 * Portfolio-Only Feature
 * 
 * Deploys just the portfolio management contracts:
 * - Portfolio Factory
 * 
 * Note: This assumes that a DEX already exists on the network.
 * The Portfolio module will automatically use the existing DEX contracts.
 */
export default buildModule("PortfolioOnlyFeature", (m) => {
    // Deploy portfolio system (which will use existing DEX)
    const portfolioDeployment = m.useModule(PortfolioModule);

    // Return portfolio contracts
    return {
        portfolioFactory: portfolioDeployment.portfolioFactory
    };
});
