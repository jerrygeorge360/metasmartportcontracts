# 🏗️ Smart Portfolio Contracts - Setup Guide

## 📁 Project Structure

```
scripts/
├── 01-deploy/          # Contract deployment
│   └── deploy-all.ts   # Deploy all contracts
│
├── 02-setup/           # Initial configuration
│   ├── calculate-init-hash.ts  # Calculate & verify init code hash
│   └── initialize-dex.ts       # Setup DEX with initial liquidity
│
├── 03-liquidity/       # Liquidity management
│   ├── add-liquidity.ts       # Add liquidity to pairs
│   └── remove-liquidity.ts    # Remove liquidity from pairs
│
├── 04-trading/         # Trading operations
│   └── swap.ts         # Swap tokens
│
├── 05-utilities/       # Token utilities
│   ├── wmon-deposit.ts        # Convert ETH to WMON
│   ├── wmon-withdraw.ts       # Convert WMON to ETH
│   └── approve-tokens.ts      # Approve tokens for trading
│
├── 06-portfolio/       # Portfolio management
│   ├── create-portfolio.ts    # Create new portfolio
│   ├── view-portfolio.ts      # View portfolio details
│   └── rebalance.ts          # Rebalance portfolio
│
├── 07-queries/         # Data queries
│   ├── get-reserves.ts        # Check pair reserves
│   ├── wmon-info.ts          # WMON contract info
│   └── get-pair.ts           # Get pair addresses
│
├── 08-helpers/         # Utility functions
│   └── addresses.ts    # Contract address management
│
└── 09-workflows/       # Complete workflows
    └── full-setup.ts   # Complete setup automation
```

```
ignition/modules/
├── shared/             # Core deployment modules
│   ├── Wmon.ts        # WMON deployment
│   ├── Tokens.ts      # Test tokens deployment
│   ├── Dex.ts         # DEX deployment
│   └── Portfolio.ts   # Portfolio system deployment
│
├── features/          # Complete deployment scenarios
│   ├── full-deployment.ts    # Complete ecosystem
│   ├── dex-only.ts          # DEX ecosystem only
│   ├── portfolio-only.ts    # Portfolio system only
│   └── minimal.ts           # Tokens only
│
└── environments/      # Environment configurations
    ├── localhost.ts   # Development settings
    ├── testnet.ts     # Testnet settings
    └── mainnet.ts     # Production settings
```

## 🚀 Quick Start

### Option 1: Complete Automated Setup (Scripts)
```bash
npm run workflow:full-setup
```

### Option 2: Complete Declarative Setup (Ignition)
```bash
npx hardhat ignition deploy ignition/modules/features/full-deployment.ts --network localhost
```

## 📋 Deployment Methods

## 🎭 Method A: Script-Based Deployment (Imperative)

Step-by-step control with organized scripts:

### Complete Automated Workflow
```bash
npm run workflow:full-setup
```

### Manual Step-by-Step Setup

1. **Deploy Contracts**
   ```bash
   npm run deploy:all
   ```

2. **Calculate Init Code Hash** 
   ```bash
   npm run setup:init-hash
   ```

3. **Initialize DEX**
   ```bash
   npm run setup:initialize-dex
   ```

4. **Verify Setup**
   ```bash
   npm run query:reserves
   ```

### Individual Operations

**Liquidity Management:**
```bash
npm run liquidity:add      # Add liquidity to specific pairs
npm run liquidity:remove   # Remove liquidity from pairs
```

**Trading Operations:**
```bash
npm run trade:swap         # Execute token swaps
```

**Utilities:**
```bash
npm run utility:wmon-deposit    # Convert ETH to WMON
npm run utility:wmon-withdraw   # Convert WMON back to ETH
npm run utility:approve-tokens  # Approve tokens for router
```

**Portfolio Management:**
```bash
npm run portfolio:create    # Create new smart portfolio
npm run portfolio:view      # View portfolio details
npm run portfolio:rebalance # Rebalance existing portfolio
```

**Queries & Monitoring:**
```bash
npm run query:reserves     # Check all pair reserves
npm run query:wmon        # WMON contract information
npm run query:pair        # Get trading pair addresses
```

## 🏗️ Method B: Ignition-Based Deployment (Declarative)

Choose the deployment scenario that fits your needs:

### Complete Ecosystem Deployment
```bash
# Deploy everything: WMON + Tokens + DEX + Portfolio
npx hardhat ignition deploy ignition/modules/features/full-deployment.ts --network localhost
```

### DEX-Only Deployment  
```bash
# Deploy trading infrastructure only: WMON + Tokens + DEX
npx hardhat ignition deploy ignition/modules/features/dex-only.ts --network localhost
```

### Portfolio-Only Deployment
```bash
# Deploy portfolio system (assumes DEX already exists)
npx hardhat ignition deploy ignition/modules/features/portfolio-only.ts --network localhost
```

### Minimal Testing Deployment
```bash
# Deploy just tokens for unit testing
npx hardhat ignition deploy ignition/modules/features/minimal.ts --network localhost
```

### Custom Module Deployment
```bash
# Deploy individual modules
npx hardhat ignition deploy ignition/modules/shared/Wmon.ts --network localhost
npx hardhat ignition deploy ignition/modules/shared/Tokens.ts --network localhost
npx hardhat ignition deploy ignition/modules/shared/Dex.ts --network localhost
npx hardhat ignition deploy ignition/modules/shared/Portfolio.ts --network localhost
```

## 🌍 Multi-Environment Deployment

### Localhost (Development)
```bash
# Scripts approach
npm run workflow:full-setup

# Ignition approach  
npx hardhat ignition deploy ignition/modules/features/full-deployment.ts --network localhost
```

### Testnet (Sepolia/Goerli)
```bash
# Set up private key first
npx hardhat keystore set SEPOLIA_PRIVATE_KEY

# Scripts approach
npm run deploy:all -- --network sepolia
npm run setup:initialize-dex -- --network sepolia

# Ignition approach
npx hardhat ignition deploy ignition/modules/features/full-deployment.ts --network sepolia
```

### Mainnet
```bash
# Set up private key first  
npx hardhat keystore set MAINNET_PRIVATE_KEY

# Scripts approach (recommended for production)
npm run deploy:all -- --network mainnet
npm run setup:init-hash -- --network mainnet
npm run setup:initialize-dex -- --network mainnet

# Ignition approach
npx hardhat ignition deploy ignition/modules/features/full-deployment.ts --network mainnet
```

## 🔧 Environment-Specific Configurations

Each environment has tailored settings:

### 🏠 Localhost
- **Token Supplies**: 1M+ tokens for extensive testing
- **Liquidity**: 10K DAI + 10 ETH per pair  
- **Gas Limits**: High (30M)
- **Use Case**: Development and testing

### 🧪 Testnet
- **Token Supplies**: 100K tokens for realistic testing
- **Liquidity**: 1K DAI + 1 ETH per pair
- **Gas Limits**: Moderate (10M)
- **Use Case**: Public testing and staging

### 🌐 Mainnet
- **Token Supplies**: 10K tokens (conservative)
- **Liquidity**: 100 DAI + 0.1 ETH per pair (minimal)
- **Gas Limits**: Conservative (8M)
- **Security**: Timelock, multi-sig, emergency pause
- **Use Case**: Production deployment

## 📊 Comparison: Scripts vs Ignition

| Feature | Scripts (Imperative) | Ignition (Declarative) |
|---------|---------------------|------------------------|
| **Control** | Step-by-step control | Scenario-based |
| **Flexibility** | High customization | Predefined scenarios |
| **Complexity** | Manual coordination | Automatic dependencies |
| **Debugging** | Easy to debug steps | Module-level debugging |
| **Best For** | Custom workflows | Standard deployments |
| **Resumability** | Manual restart | Automatic resume |

## 🎯 Deployment Recommendations

### For Development:
- **Use Scripts**: When you need to test individual components
- **Use Ignition**: When you want quick, complete setups

### For Testing:
- **Use Ignition**: Consistent, repeatable deployments
- **Use Scripts**: When testing specific workflows

### For Production:
- **Use Scripts**: More control over critical deployment steps
- **Use Ignition**: When you trust the predefined scenarios

## 📋 Available Commands

### 🏗️ Deployment
- `npm run deploy:all` - Deploy all contracts

### ⚙️ Setup
- `npm run setup:init-hash` - Calculate and verify init code hash
- `npm run setup:initialize-dex` - Initialize DEX with liquidity pools

### 💧 Liquidity
- `npm run liquidity:add` - Add liquidity to a pair
- `npm run liquidity:remove` - Remove liquidity from a pair

### 📈 Trading  
- `npm run trade:swap` - Swap tokens

### 🔧 Utilities
- `npm run utility:wmon-deposit` - Convert ETH to WMON
- `npm run utility:wmon-withdraw` - Convert WMON to ETH  
- `npm run utility:approve-tokens` - Approve all tokens for trading

### 💼 Portfolio
- `npm run portfolio:create` - Create new portfolio
- `npm run portfolio:view` - View portfolio details
- `npm run portfolio:rebalance` - Rebalance portfolio

### 🔍 Queries
- `npm run query:reserves` - Check pair reserves and prices
- `npm run query:wmon` - WMON contract information
- `npm run query:pair` - Get trading pair addresses

### 🔄 Workflows
- `npm run workflow:full-setup` - Complete automated setup

### 🛠️ Development
- `npm run dev:node` - Start local Hardhat node
- `npm run dev:console` - Open Hardhat console
- `npm run compile` - Compile contracts
- `npm run test` - Run tests
- `npm run clean` - Clean build artifacts

## � Verification & Monitoring

After any deployment method, verify your setup:

```bash
# Check deployed contracts
npm run query:reserves

# Verify token balances  
npm run query:wmon

# Test trading functionality
npm run trade:swap

# Create and view portfolios
npm run portfolio:create
npm run portfolio:view
```

## 🎯 What Gets Created

After running the full setup:

✅ **Deployed Contracts:**
- WMON (Wrapped MON)
- UniswapV2 Factory & Router
- Test Tokens (DAI, USDC, USDT, WBTC)
- Portfolio Factory

✅ **Trading Pairs with Liquidity:**
- DAI/WMON (10,000 DAI + 10 WMON)
- USDC/WMON (10,000 USDC + 10 WMON) 
- USDT/WMON (10,000 USDT + 10 WMON)
- WBTC/WMON (1 WBTC + 50 WMON)
- DAI/USDC (5,000 DAI + 5,000 USDC)

✅ **Ready for:**
- Token swapping
- Portfolio creation
- Liquidity provision
- Trading operations

## 📋 Troubleshooting

### Common Issues:

**Init Code Hash Mismatch:**
```bash
npm run setup:init-hash  # Recalculate and update
```

**Insufficient Liquidity:**
```bash
npm run liquidity:add    # Add more liquidity
```

**Gas Estimation Failed:**
```bash
# Check network congestion or increase gas limit in environment config
```

**Contract Not Found:**
```bash
# Verify deployment completed successfully
npm run query:reserves
```

**Ignition Module Errors:**
```bash
# Check deployment status
npx hardhat ignition status ignition/modules/features/full-deployment.ts --network localhost

# Resume failed deployment
npx hardhat ignition deploy ignition/modules/features/full-deployment.ts --network localhost --resume
```

## 🚀 Next Steps

After successful deployment:

1. **Test Trading**: Execute some swaps to verify DEX functionality
2. **Create Portfolios**: Set up smart portfolios with different allocations
3. **Monitor Performance**: Use query scripts to track reserves and prices
4. **Add More Liquidity**: Enhance trading depth as needed
5. **Integrate Frontend**: Connect your UI to the deployed contracts

## 💡 Pro Tips

- **Always test locally first** before deploying to testnets or mainnet
- **Keep track of deployed addresses** using the address helper functions
- **Monitor gas costs** especially on mainnet deployments
- **Use environment configs** to maintain consistent parameters
- **Verify contracts** on block explorers after deployment
- **Use Ignition for standard deployments**, scripts for custom workflows
- **Resume failed Ignition deployments** instead of starting over

---

Choose the deployment method that best fits your workflow. Both scripts and Ignition approaches will give you a fully functional DeFi ecosystem!
