/**
 * Localhost Environment Configuration
 * 
 * Configuration for local development on Hardhat network.
 * - High token supplies for testing
 * - Large initial liquidity amounts
 * - Fast deployment settings
 */
export const LocalhostConfig = {
    // Token Configuration
    tokenConfig: {
        // Initial token supplies (large amounts for testing)
        initialSupply: {
            dai: "1000000000000000000000000", // 1M DAI
            usdc: "1000000000000", // 1M USDC (6 decimals)
            usdt: "1000000000000", // 1M USDT (6 decimals)
            wbtc: "10000000000" // 100 WBTC (8 decimals)
        }
    },

    // DEX Configuration
    dexConfig: {
        // Initial liquidity for pairs (large amounts for testing)
        initialLiquidity: {
            daiWmon: {
                token: "10000000000000000000000", // 10K DAI
                wmon: "10000000000000000000" // 10 ETH
            },
            usdcWmon: {
                token: "10000000000", // 10K USDC
                wmon: "10000000000000000000" // 10 ETH
            },
            usdtWmon: {
                token: "10000000000", // 10K USDT
                wmon: "10000000000000000000" // 10 ETH
            },
            wbtcWmon: {
                token: "100000000", // 1 WBTC
                wmon: "50000000000000000000" // 50 ETH
            },
            stablePair: {
                dai: "5000000000000000000000", // 5K DAI
                usdc: "5000000000" // 5K USDC
            }
        }
    },

    // Portfolio Configuration
    portfolioConfig: {
        // Default portfolio settings
        managementFee: "100", // 1% (100 basis points)
        performanceFee: "1000", // 10% (1000 basis points)
        maxPositions: "10"
    },

    // Gas and Timing Configuration
    deploymentConfig: {
        gasLimit: "30000000",
        deadline: "20" // 20 minutes
    }
};
