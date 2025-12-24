// Environment configurations
// These provide network-specific parameters for deployment

import { LocalhostConfig } from "./localhost.js";
import { TestnetConfig } from "./testnet.js";
import { MainnetConfig } from "./mainnet.js";

export { LocalhostConfig, TestnetConfig, MainnetConfig };

/**
 * Environment Selector
 * 
 * Helper function to get configuration based on network name
 */
export function getEnvironmentConfig(network: string) {
    switch (network.toLowerCase()) {
        case "localhost":
        case "hardhat":
            return LocalhostConfig;
            
        case "sepolia":
        case "goerli":
        case "testnet":
        case "monadTestnet":
            return TestnetConfig;
            
        case "mainnet":
        case "ethereum":
            return MainnetConfig;
            
        default:
            console.warn(`Unknown network: ${network}, using localhost config`);
            return LocalhostConfig;
    }
}

/**
 * Usage Examples:
 * 
 * import { getEnvironmentConfig, LocalhostConfig } from "./environments/index.js";
 * 
 * // Get config for current network
 * const config = getEnvironmentConfig("localhost");
 * 
 * // Use specific config
 * const localhostConfig = LocalhostConfig;
 * const tokenAmount = localhostConfig.dexConfig.initialLiquidity.daiWmon.token;
 */
