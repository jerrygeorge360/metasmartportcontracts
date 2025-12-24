import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import WmonModule from "../shared/Wmon.js";
import TokensModule from "../shared/Tokens.js";
import DexModule from "../shared/Dex.js";

/**
 * DEX-Only Feature
 * 
 * Deploys just the DEX ecosystem for trading:
 * - WMON (wrapped native token)
 * - Test Tokens (DAI, USDC, USDT, WBTC)
 * - DEX (Factory + Router)
 * 
 * Use this when you only need trading functionality without portfolio management.
 */
export default buildModule("DexOnlyFeature", (m) => {
    // Deploy core trading infrastructure
    const wmonDeployment = m.useModule(WmonModule);
    const tokensDeployment = m.useModule(TokensModule);
    const dexDeployment = m.useModule(DexModule);

    // Return trading-related contracts
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
        router: dexDeployment.router
    };
});
