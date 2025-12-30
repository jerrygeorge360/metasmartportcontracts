import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { configVariable, defineConfig } from "hardhat/config";
import * as dotenv from "dotenv";
dotenv.config();
export default defineConfig({
  plugins: [hardhatToolboxViemPlugin],
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    monadTestnet: {
      type: "http",
      url: "https://testnet-rpc.monad.xyz",
      accounts: [configVariable("PRIVATE_KEY")],
      chainId: 10143,
    },
    sepolia: {
      type: "http",
      url: configVariable("ALCHEMY_SEPOLIA_RPC_URL"),
      accounts: [configVariable("PRIVATE_KEY")],
      chainId: 11155111,
    },
    
  },
  
  ignition: {
    strategyConfig: {
      create2: {
        // Salt for deterministic addresses across networks (must be exactly 32 bytes)
        salt: "0x4d6574615370617274506f727400000000000000000000000000000000000000",
      },
    },
  },

  verify: {
    etherscan: (
      {
        enabled: true,
        apiKey: configVariable("ETHERSCAN_API_KEY"),
        customChains: [
          {
            network: "monadMainnet",
            chainId: 143,
            urls: {
              apiURL: "https://api.etherscan.io/v2/api?chainid=143",
              browserURL: "https://monadscan.com",
            },
          },
          {
            network: "monadTestnet",
            chainId: 10143,
            urls: {
              apiURL: "https://api.etherscan.io/v2/api?chainid=10143",
              browserURL: "https://testnet.monadscan.com",
            },
          },
          {
            network: "sepolia",
            chainId: 11155111,
            urls: {
              apiURL: "https://api.etherscan.io/api",
              browserURL: "https://sepolia.etherscan.io",
            },
          },
        ],
      } as any
    ),
    sourcify: {
      enabled: true,
      apiUrl: "https://sourcify-api-monad.blockvision.org",
    },
    
  }
});
