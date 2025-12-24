# Contracts Directory Structure

## Core Contracts (`/core`)
- **SmartPortfolio.sol** - PortfolioFactory contract for creating user portfolios
- **SmartPortfolioFactory.sol** - UserPortfolio contract with rebalancing logic

## DEX Contracts (`/dex`)
- **UniswapV2Factory.sol** - Creates and manages trading pairs
- **UniswapV2Pair.sol** - Individual trading pair contract
- **UniswapV2Router02.sol** - Router for swapping tokens
- **interfaces/IUniswapV2.sol** - Uniswap V2 interfaces

## Token Contracts (`/tokens`)
- **WMON.sol** - Wrapped MON (native token wrapper)
- **TestTokens.sol** - Test ERC20 tokens (DAI, USDC, USDT, WBTC)

## Utility Contracts (`/utils`)
- **HashCalculator.sol** - Helper for calculating init code hash

## Test Contracts (`/test`)
- **WMON.t.sol** - WMON contract tests

## Legacy (`/hardlocal`, `/monBlockchain`)
- Old structure, kept for backward compatibility
- Will be deprecated in future versions
