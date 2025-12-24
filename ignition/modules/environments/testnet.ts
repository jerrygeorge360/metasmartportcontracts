/**
 * Testnet Environment Configuration
 * 
 * Configuration for testnet deployment (Sepolia, Goerli, etc.).
 * - Moderate token supplies
 * - Reasonable liquidity amounts
 * - Production-like settings but with test values
 */
export const TestnetConfig = {
    // Token Configuration
    tokenConfig: {
        // Initial token supplies (moderate amounts for testnet)
        initialSupply: {
            dai: "100000000000000000000000", // 100K DAI
            usdc: "100000000000", // 100K USDC (6 decimals)
            usdt: "100000000000", // 100K USDT (6 decimals)
            wbtc: "1000000000" // 10 WBTC (8 decimals)
        }
    },

    // DEX Configuration
    dexConfig: {
        // Initial liquidity for pairs (moderate amounts)
        initialLiquidity: {
            daiWmon: {
                token: "1000000000000000000000", // 1K DAI
                wmon: "1000000000000000000" // 1 ETH
            },
            usdcWmon: {
                token: "1000000000", // 1K USDC
                wmon: "1000000000000000000" // 1 ETH
            },
            usdtWmon: {
                token: "1000000000", // 1K USDT
                wmon: "1000000000000000000" // 1 ETH
            },
            wbtcWmon: {
                token: "10000000", // 0.1 WBTC
                wmon: "5000000000000000000" // 5 ETH
            },
            stablePair: {
                dai: "500000000000000000000", // 500 DAI
                usdc: "500000000" // 500 USDC
            }
        }
    },

    // Portfolio Configuration
    portfolioConfig: {
        // Production-like portfolio settings
        managementFee: "200", // 2% (200 basis points)
        performanceFee: "2000", // 20% (2000 basis points)
        maxPositions: "8"
    },

    // Gas and Timing Configuration
    deploymentConfig: {
        gasLimit: "10000000",
        deadline: "30" // 30 minutes
    },

    // External Contract Addresses (if any exist on testnet)
    externalContracts: {
        // Add known testnet addresses here
        // e.g., existing DEX routers, oracles, etc.
    }
};
