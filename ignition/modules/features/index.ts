// Feature deployment modules
// Each feature represents a complete deployment scenario

export { default as FullDeploymentFeature } from "./full-deployment.js";
export { default as DexOnlyFeature } from "./dex-only.js";
export { default as PortfolioOnlyFeature } from "./portfolio-only.js";
export { default as MinimalFeature } from "./minimal.js";

/**
 * Usage Examples:
 * 
 * // Full deployment (everything)
 * npx hardhat ignition deploy ignition/modules/features/full-deployment.ts --network localhost
 * 
 * // DEX only (trading without portfolio)
 * npx hardhat ignition deploy ignition/modules/features/dex-only.ts --network localhost
 * 
 * // Portfolio only (assumes DEX exists)
 * npx hardhat ignition deploy ignition/modules/features/portfolio-only.ts --network localhost
 * 
 * // Minimal (just tokens for testing)
 * npx hardhat ignition deploy ignition/modules/features/minimal.ts --network localhost
 */
