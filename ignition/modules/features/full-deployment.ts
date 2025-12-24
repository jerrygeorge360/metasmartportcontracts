import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import WmonModule from "../shared/Wmon.js";
import TokensModule from "../shared/Tokens.js";
import DexModule from "../shared/Dex.js";
import PortfolioModule from "../shared/Portfolio.js";

/**
 * Full Deployment Feature
 * 
 * Deploys the complete Smart Portfolio ecosystem:
 * - WMON (wrapped native token)
 * - Test Tokens (DAI, USDC, USDT, WBTC)
 * - DEX (Factory + Router)
 * - Portfolio Management (Factory + Implementation)
 * 
 * This is the complete setup for a fully functional trading and portfolio system.
 */
export default buildModule("FullDeploymentFeature", (m) => {
    // Deploy all core modules
    const wmonDeployment = m.useModule(WmonModule);
    const tokensDeployment = m.useModule(TokensModule);
    const dexDeployment = m.useModule(DexModule);
    const portfolioDeployment = m.useModule(PortfolioModule);

    // Return all deployed contracts for easy access
    return {
        // Infrastructure
        wmon: wmonDeployment.wmon,
        
        // Test Tokens
        dai: tokensDeployment.dai,
        usdc: tokensDeployment.usdc,
        usdt: tokensDeployment.usdt,
        wbtc: tokensDeployment.wbtc,
        
        // DEX
        factory: dexDeployment.factory,
        router: dexDeployment.router,
        
        // Portfolio
        portfolioFactory: portfolioDeployment.portfolioFactory
    };
});
