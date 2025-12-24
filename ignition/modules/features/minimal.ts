import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import WmonModule from "../shared/Wmon.js";
import TokensModule from "../shared/Tokens.js";

/**
 * Minimal Feature
 * 
 * Deploys just the basic tokens for testing:
 * - WMON (wrapped native token)
 * - Test Tokens (DAI, USDC, USDT, WBTC)
 * 
 * Use this for unit testing when you don't need the full DEX or portfolio system.
 * Perfect for testing token functionality in isolation.
 */
export default buildModule("MinimalFeature", (m) => {
    // Deploy basic token infrastructure
    const wmonDeployment = m.useModule(WmonModule);
    const tokensDeployment = m.useModule(TokensModule);

    // Return basic tokens
    return {
        // Infrastructure
        wmon: wmonDeployment.wmon,
        
        // Test Tokens
        dai: tokensDeployment.dai,
        usdc: tokensDeployment.usdc,
        usdt: tokensDeployment.usdt,
        wbtc: tokensDeployment.wbtc
    };
});
