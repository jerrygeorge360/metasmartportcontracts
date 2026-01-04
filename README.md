# 🔥 MetaSmartPort Contracts

A comprehensive decentralized ex#### 💡 Interact with Contracts
```bash
# Set network for all commands
export NETWORK=monadTestnet

# Initialize DEX with liquidity
npm run setup:dex -- --network $NETWORK

# Add liquidity to pools
npm run liquidity:add -- --network $NETWORK

# Execute token swaps
npm run trading:swap -- --network $NETWORK

# Create and manage portfolios
npm run portfolio:create -- --network $NETWORK
```

### Ethereum Sepolia (Chain ID: 11155111)
✅ **Deployed and Verified on Etherscan**

#### 🪙 Token Contracts
- **Test DAI**: [`0xAd22b4EC8cdd8A803d0052632566F6334A04F1F3`](https://sepolia.etherscan.io/address/0xAd22b4EC8cdd8A803d0052632566F6334A04F1F3#code)
- **Test USDC**: [`0xcF9884827F587Cd9a0bDce33995B2333eE7e8285`](https://sepolia.etherscan.io/address/0xcF9884827F587Cd9a0bDce33995B2333eE7e8285#code)
- **Test USDT**: [`0x1861BB06286aAb0fDA903620844b4Aef4894b719`](https://sepolia.etherscan.io/address/0x1861BB06286aAb0fDA903620844b4Aef4894b719#code)
- **Test WBTC**: [`0x4267652AF61B4bE50A39e700ee2a160f42371f54`](https://sepolia.etherscan.io/address/0x4267652AF61B4bE50A39e700ee2a160f42371f54#code)

#### 📊 Portfolio Management
- **PortfolioFactory**: [`0x49C17A91672c629543a14782809E246296317bA3`](https://sepolia.etherscan.io/address/0x49C17A91672c629543a14782809E246296317bA3#code)

#### 🔗 Existing DEX Infrastructure (Sepolia)
*Uses existing Sepolia Uniswap V2 contracts:*
- **UniswapV2Factory**: [`0xF62c03E08ada871A0bEb309762E260a7a6a880E6`](https://sepolia.etherscan.io/address/0xF62c03E08ada871A0bEb309762E260a7a6a880E6)
- **UniswapV2Router02**: [`0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3`](https://sepolia.etherscan.io/address/0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3)

#### 🔗 Quick Links
- **Network**: Ethereum Sepolia Testnet
- **RPC URL**: Alchemy (configured via `ALCHEMY_SEPOLIA_RPC_URL`)
- **Block Explorer**: [sepolia.etherscan.io](https://sepolia.etherscan.io)
- **Faucet**: [Sepolia Faucet](https://sepoliafaucet.com/)

#### 🔍 Contract Verification
To deploy your own contracts on Sepolia:

```bash
# Deploy only test tokens and portfolio (uses existing Sepolia DEX)
npx hardhat ignition deploy ignition/modules/features/sepolia-deployment.ts --network sepolia

# Verify all deployed contracts automatically
npx hardhat ignition verify chain-11155111 --network sepolia
```

**Requirements for verification:**
- Ensure `dotenv` is installed: `npm install dotenv`
- Set `PRIVATE_KEY` in your `.env` file
- Set `ETHERSCAN_API_KEY` in your `.env` file (for Etherscan verification)
- Set `ALCHEMY_SEPOLIA_RPC_URL` in your `.env` file (Alchemy RPC endpoint)

#### 💡 Interact with Contracts
```bash
# Set network for all commands
export NETWORK=sepolia

# Add liquidity using deployed test tokens
npx hardhat run scripts/03-liquidity/add-liquidity-sepolia.ts --network sepolia

# Add custom amounts or tokens
npx hardhat run scripts/03-liquidity/add-liquidity-sepolia.ts --network sepolia -- --tokenA 0xAd22... --tokenB 0xcF98... --amountA 100 --amountB 50

# Create and manage portfolios (uses existing Sepolia DEX)
npm run portfolio:create -- --network $NETWORK

# Portfolio operations
npm run portfolio:view -- --network $NETWORK
npm run portfolio:rebalance -- --network $NETWORK
```smart portfolio management system built on Ethereum. This project provides a complete DeFi infrastructure including token swapping, liquidity management, and automated portfolio rebalancing.

## 🚀 Project Overview

MetaSmartPort consists of several key components:

### 🏗️ Core Contracts
- **WMON**: Wrapped native token for trading
- **Test Tokens**: DAI, USDC, USDT, WBTC for development
- **DEX System**: Uniswap V2 compatible factory and router
- **Portfolio Management**: Smart portfolio factory and implementation

### 🎯 Key Features
- **Decentralized Trading**: Full Uniswap V2 compatible DEX
- **Liquidity Management**: Add/remove liquidity with automated pair creation
- **Portfolio Management**: Create and manage diversified portfolios
- **Automated Rebalancing**: Smart contract-based portfolio rebalancing
- **Multi-Environment**: Localhost, testnet, and mainnet configurations

## � Live Deployments

### Monad Testnet (Chain ID: 10143)
✅ **Deployed and Verified on MonadScan**

#### 🔧 DEX Infrastructure
- **UniswapV2Factory**: [`0x7Bf4523bA76772F7Ed499aba5eb4Ea83168594b6`](https://testnet.monadscan.com/address/0x7Bf4523bA76772F7Ed499aba5eb4Ea83168594b6#code)
- **UniswapV2Router02**: [`0xcF9884827F587Cd9a0bDce33995B2333eE7e8285`](https://testnet.monadscan.com/address/0xcF9884827F587Cd9a0bDce33995B2333eE7e8285#code)

#### 🪙 Token Contracts
- **WMON (Wrapped MON)**: [`0xAd22b4EC8cdd8A803d0052632566F6334A04F1F3`](https://testnet.monadscan.com/address/0xAd22b4EC8cdd8A803d0052632566F6334A04F1F3#code)
- **Test DAI**: [`0x8A2F5094992835Cc6C2c83e515FbdA4270182fE9`](https://testnet.monadscan.com/address/0x8A2F5094992835Cc6C2c83e515FbdA4270182fE9#code)
- **Test USDC**: [`0x065A0af7bfF900deB2Bcb7Ae3fc6e1dD52579aC7`](https://testnet.monadscan.com/address/0x065A0af7bfF900deB2Bcb7Ae3fc6e1dD52579aC7#code)
- **Test USDT**: [`0x8a1515Bce4Fb424343E8187959dF197cB33Fc1b9`](https://testnet.monadscan.com/address/0x8a1515Bce4Fb424343E8187959dF197cB33Fc1b9#code)
- **Test WBTC**: [`0x49C17A91672c629543a14782809E246296317bA3`](https://testnet.monadscan.com/address/0x49C17A91672c629543a14782809E246296317bA3#code)

#### 📊 Portfolio Management
- **PortfolioFactory**: [`0x1861BB06286aAb0fDA903620844b4Aef4894b719`](https://testnet.monadscan.com/address/0x1861BB06286aAb0fDA903620844b4Aef4894b719#code)

#### 🔗 Quick Links
- **Network**: Monad Testnet
- **RPC URL**: `https://testnet-rpc.monad.xyz`
- **Block Explorer**: [testnet.monadscan.com](https://testnet.monadscan.com)
- **Faucet**: Available in Monad Discord

#### � Contract Verification
To verify your own deployment on Monad testnet:

```bash
# Deploy contracts using Hardhat Ignition
npx hardhat ignition deploy ignition/modules/features/full-deployment.ts --network monadTestnet

# Verify all deployed contracts automatically
npx hardhat ignition verify chain-10143 --network monadTestnet
```

**Requirements for verification:**
- Ensure `dotenv` is installed: `npm install dotenv`
- Set `PRIVATE_KEY` in your `.env` file
- Set `ETHERSCAN_API_KEY` in your `.env` file (for MonadScan verification)

#### �💡 Interact with Contracts
```bash
# Set network for all commands
export NETWORK=monadTestnet

# Initialize DEX with liquidity
npm run setup:dex -- --network $NETWORK

# Add liquidity to pools
npm run liquidity:add -- --network $NETWORK

# Execute token swaps
npm run trading:swap -- --network $NETWORK

# Create and manage portfolios
npm run portfolio:create -- --network $NETWORK
```

## �📁 Project Structure

```
├── contracts/                 # Smart contracts
│   ├── core/                 # Portfolio management contracts
│   ├── dex/                  # DEX contracts (Factory, Router, Pair)
│   ├── tokens/               # ERC-20 test tokens
│   └── utils/                # Utility contracts
│
├── scripts/                  # Deployment and interaction scripts
│   ├── 01-deploy/           # Contract deployment
│   ├── 02-setup/            # DEX initialization
│   ├── 03-liquidity/        # Liquidity management
│   ├── 04-trading/          # Token swapping
│   ├── 05-utilities/        # Token utilities (WMON deposit/withdraw)
│   ├── 06-portfolio/        # Portfolio management
│   ├── 07-queries/          # Data queries
│   ├── 08-helpers/          # Utility functions
│   └── 09-workflows/        # Complete automation
│
├── ignition/                 # Hardhat Ignition deployment
│   └── modules/
│       ├── shared/          # Core deployment modules
│       ├── features/        # Complete deployment scenarios
│       └── environments/    # Environment-specific configurations
│
├── test/                    # Test files
└── artifacts/              # Compiled contracts
```

## 🛠️ Technology Stack

- **Hardhat 3 Beta**: Development framework
- **Solidity 0.8.28**: Smart contract language
- **Viem**: Ethereum interaction library
- **TypeScript**: Type-safe scripting
- **Hardhat Ignition**: Declarative deployment system
- **OpenZeppelin**: Secure contract libraries

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## 🚀 Quick Start

### 1. Installation

```bash
git clone https://github.com/jerrygeorge360/metasmartportcontracts
cd metasmartportcontracts
npm install
```

### 2. Environment Setup

Start a local Hardhat node:
```bash
npm run dev:node
```

### 3. Deploy Everything (Option A: Scripts)

Automated deployment with scripts:
```bash
# Complete setup in one command
npm run workflow:full-setup
```

### 3. Deploy Everything (Option B: Ignition)

Declarative deployment with Ignition:
```bash
# Deploy complete ecosystem
npx hardhat ignition deploy ignition/modules/features/full-deployment.ts --network localhost
```

## 📚 Deployment Options

### 🎭 Script-Based Deployment (Imperative)

Step-by-step deployment using organized scripts:

```bash
# 1. Deploy all contracts
npm run deploy:all

# 2. Initialize DEX with liquidity
npm run setup:initialize-dex

# 3. Verify setup
npm run query:reserves
```

### 🏗️ Ignition-Based Deployment (Declarative)

Choose from different deployment scenarios:

```bash
# Complete ecosystem (WMON + Tokens + DEX + Portfolio)
npx hardhat ignition deploy ignition/modules/features/full-deployment.ts --network localhost

# DEX only (trading without portfolio)
npx hardhat ignition deploy ignition/modules/features/dex-only.ts --network localhost

# Portfolio only (assumes DEX exists)
npx hardhat ignition deploy ignition/modules/features/portfolio-only.ts --network localhost

# Minimal setup (just tokens for testing)
npx hardhat ignition deploy ignition/modules/features/minimal.ts --network localhost
```

## 🔧 Available Scripts

### 🏗️ Deployment
```bash
npm run deploy:all                 # Deploy all contracts
```

### ⚙️ Setup & Configuration
```bash
npm run setup:init-hash           # Calculate init code hash
npm run setup:initialize-dex      # Initialize DEX with liquidity
```

### 💧 Liquidity Management
```bash
npm run liquidity:add             # Add liquidity to pairs
npm run liquidity:remove          # Remove liquidity
```

### 📈 Trading
```bash
npm run trade:swap                # Swap tokens
```

### 🔧 Utilities
```bash
npm run utility:wmon-deposit      # Convert ETH to WMON
npm run utility:wmon-withdraw     # Convert WMON to ETH
npm run utility:approve-tokens    # Approve tokens for trading
```

### 💼 Portfolio Management
```bash
npm run portfolio:create          # Create new portfolio
npm run portfolio:view            # View portfolio details
npm run portfolio:rebalance       # Rebalance portfolio
```

### 🔍 Queries & Analytics
```bash
npm run query:reserves            # Check pair reserves
npm run query:wmon               # WMON contract info
npm run query:pair               # Get pair addresses
```

### 🔄 Complete Workflows
```bash
npm run workflow:full-setup       # Complete automated setup
```

### 🛠️ Development
```bash
npm run dev:node                  # Start local Hardhat node
npm run dev:console              # Open Hardhat console
npm run compile                  # Compile contracts
npm run test                     # Run tests
npm run clean                    # Clean artifacts
```

## 🌍 Multi-Environment Support

The project supports different deployment environments with tailored configurations:

### 🏠 Localhost (Development)
- High token supplies (1M+ tokens)
- Large liquidity pools
- Fast deployment settings

### 🧪 Testnet (Staging)
- Moderate token supplies (100K tokens)
- Reasonable liquidity pools
- Production-like settings

### 🌐 Mainnet (Production)
- Conservative token supplies (10K tokens)
- Minimal initial liquidity
- Security-focused configurations

## 🏗️ Architecture Details

### DEX Components
- **UniswapV2Factory**: Creates and manages trading pairs
- **UniswapV2Router02**: Handles swaps and liquidity operations
- **UniswapV2Pair**: Individual trading pair contracts

### Portfolio System
- **SmartPortfolioFactory**: Creates portfolio instances
- **SmartPortfolio**: Manages individual portfolios with automated rebalancing

### Token Ecosystem
- **WMON**: Wrapped native token for trading pairs
- **Test Tokens**: DAI, USDC, USDT, WBTC with realistic decimals

## 🧪 Testing

Run the test suite:
```bash
# All tests
npm test

# Solidity tests only
npx hardhat test solidity

# TypeScript tests only  
npx hardhat test nodejs
```

## 🔍 Verification & Monitoring

### Check DEX Status
```bash
npm run query:reserves    # View all pair reserves and prices
npm run query:pair       # Get specific pair addresses
```

### Monitor Portfolio Performance
```bash
npm run portfolio:view   # View portfolio details and performance
```

### Verify Token Balances
```bash
npm run query:wmon      # Check WMON contract details
```

## 📖 Documentation

- **[SETUP.md](SETUP.md)**: Detailed setup guide with both scripts and Ignition
- **[Architecture Overview](#architecture-details)**: System design and components
- **[API Reference](#available-scripts)**: Complete script and command reference

## 🚨 Security Considerations

### For Production Deployment:
1. **Multi-signature wallets** for admin functions
2. **Timelock delays** for critical operations  
3. **Audit smart contracts** before mainnet deployment
4. **Test thoroughly** on testnets first
5. **Monitor initial liquidity** amounts carefully

### Smart Contract Security:
- OpenZeppelin battle-tested libraries
- Reentrancy protection
- Access control mechanisms
- Emergency pause functionality

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🔗 Useful Links

- [Hardhat Documentation](https://hardhat.org/docs)
- [Viem Documentation](https://viem.sh/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Uniswap V2 Documentation](https://docs.uniswap.org/protocol/V2/introduction)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For questions, issues, or contributions:
- Open an [Issue](../../issues)
- Submit a [Pull Request](../../pulls)
- Join our community discussions

---

Built with ❤️ using Hardhat 3 Beta, Viem, and TypeScript.
