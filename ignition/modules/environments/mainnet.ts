/**
 * Mainnet Environment Configuration
 * 
 * Configuration for mainnet deployment.
 * - Conservative token supplies
 * - Minimal initial liquidity
 * - Production-ready settings with security focus
 */
export const MainnetConfig = {
    // Token Configuration
    tokenConfig: {
        // Initial token supplies (conservative amounts for mainnet)
        initialSupply: {
            dai: "10000000000000000000000", // 10K DAI
            usdc: "10000000000", // 10K USDC (6 decimals)
            usdt: "10000000000", // 10K USDT (6 decimals)
            wbtc: "100000000" // 1 WBTC (8 decimals)
        }
    },

    // DEX Configuration
    dexConfig: {
        // Minimal initial liquidity (add more manually after deployment)
        initialLiquidity: {
            daiWmon: {
                token: "100000000000000000000", // 100 DAI
                wmon: "100000000000000000" // 0.1 ETH
            },
            usdcWmon: {
                token: "100000000", // 100 USDC
                wmon: "100000000000000000" // 0.1 ETH
            },
            usdtWmon: {
                token: "100000000", // 100 USDT
                wmon: "100000000000000000" // 0.1 ETH
            },
            wbtcWmon: {
                token: "1000000", // 0.01 WBTC
                wmon: "500000000000000000" // 0.5 ETH
            },
            stablePair: {
                dai: "50000000000000000000", // 50 DAI
                usdc: "50000000" // 50 USDC
            }
        }
    },

    // Portfolio Configuration
    portfolioConfig: {
        // Conservative production settings
        managementFee: "100", // 1% (100 basis points)
        performanceFee: "1500", // 15% (1500 basis points)
        maxPositions: "5"
    },

    // Gas and Timing Configuration
    deploymentConfig: {
        gasLimit: "8000000",
        deadline: "60" // 1 hour
    },

    // Security Configuration
    securityConfig: {
        // Timelock for admin functions
        timelockDelay: "172800", // 48 hours
        
        // Multi-sig requirements
        requireMultiSig: true,
        
        // Emergency pause functionality
        enableEmergencyPause: true
    },

    // External Contract Addresses (mainnet)
    externalContracts: {
        // Known mainnet addresses
        uniswapV2Factory: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
        uniswapV2Router: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        // Add other known addresses as needed
    }
};
