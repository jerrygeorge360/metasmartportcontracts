import { createPublicClient, createWalletClient, http, parseAbi, formatUnits, parseUnits, getContract } from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { config } from "dotenv";

config();

// Usage:
// npx hardhat run scripts/03-liquidity/add-liquidity-sepolia.ts --network sepolia -- --tokenA <address> --tokenB <address> --amountA <amount> --amountB <amount>
// Example:
// npx hardhat run scripts/03-liquidity/add-liquidity-sepolia.ts --network sepolia -- --tokenA 0xAd22... --tokenB 0xcF98... --amountA 100 --amountB 100

// Sepolia deployed addresses
const SEPOLIA_ROUTER = "0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3";
const SEPOLIA_FACTORY = "0xF62c03E08ada871A0bEb309762E260a7a6a880E6";

// Test token addresses (deployed on Sepolia)
const TEST_TOKENS = {
  DAI: "0xAd22b4EC8cdd8A803d0052632566F6334A04F1F3",
  USDC: "0xcF9884827F587Cd9a0bDce33995B2333eE7e8285",
  USDT: "0x1861BB06286aAb0fDA903620844b4Aef4894b719",
  WBTC: "0x4267652AF61B4bE50A39e700ee2a160f42371f54",
};

const ERC20_ABI = parseAbi([
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address to, uint256 amount) returns (bool)",
]);

const ROUTER_ABI = parseAbi([
  "function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity)",
]);

async function main() {
  // Parse command line arguments
  const argv = process.argv.slice(process.argv.indexOf("--") + 1);
  const args: Record<string, string> = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i]?.replace(/^--/, "");
    const val = argv[i + 1];
    if (key) args[key] = val;
  }

  const tokenA = (args.tokenA as `0x${string}`) || TEST_TOKENS.DAI;
  const tokenB = (args.tokenB as `0x${string}`) || TEST_TOKENS.USDC;
  const amountAStr = args.amountA || "100"; // 100 tokens default
  const amountBStr = args.amountB || "100"; // 100 tokens default

  if (!process.env.PRIVATE_KEY || !process.env.ALCHEMY_SEPOLIA_RPC_URL) {
    console.error("❌ Missing PRIVATE_KEY or ALCHEMY_SEPOLIA_RPC_URL in environment variables");
    process.exit(1);
  }

  // Setup clients
  const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
  
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(process.env.ALCHEMY_SEPOLIA_RPC_URL),
  });

  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(process.env.ALCHEMY_SEPOLIA_RPC_URL),
  });

  console.log(`🚀 Adding liquidity on Sepolia`);
  console.log(`📝 Using account: ${account.address}`);
  console.log(`💧 Token A: ${tokenA}`);
  console.log(`💧 Token B: ${tokenB}`);

  // Get token contracts
  const tokenAContract = getContract({
    address: tokenA,
    abi: ERC20_ABI,
    client: publicClient,
  });

  const tokenBContract = getContract({
    address: tokenB,
    abi: ERC20_ABI,
    client: publicClient,
  });

  // Get token info
  const [symbolA, symbolB, decimalsA, decimalsB] = await Promise.all([
    tokenAContract.read.symbol(),
    tokenBContract.read.symbol(),
    tokenAContract.read.decimals(),
    tokenBContract.read.decimals(),
  ]);

  console.log(`🪙 Token A: ${symbolA} (${decimalsA} decimals)`);
  console.log(`🪙 Token B: ${symbolB} (${decimalsB} decimals)`);

  // Parse amounts based on token decimals using parseUnits
  const amountADesired = parseUnits(amountAStr, Number(decimalsA));
  const amountBDesired = parseUnits(amountBStr, Number(decimalsB));
  
  // 5% slippage tolerance
  const amountAMin = (amountADesired * 95n) / 100n;
  const amountBMin = (amountBDesired * 95n) / 100n;

  console.log(`💰 Amount A desired: ${formatUnits(amountADesired, Number(decimalsA))} ${symbolA}`);
  console.log(`💰 Amount B desired: ${formatUnits(amountBDesired, Number(decimalsB))} ${symbolB}`);

  // Check balances
  const [balanceA, balanceB] = await Promise.all([
    tokenAContract.read.balanceOf([account.address]),
    tokenBContract.read.balanceOf([account.address]),
  ]);

  console.log(`💳 Balance A: ${formatUnits(balanceA, Number(decimalsA))} ${symbolA}`);
  console.log(`💳 Balance B: ${formatUnits(balanceB, Number(decimalsB))} ${symbolB}`);

  if (balanceA < amountADesired || balanceB < amountBDesired) {
    console.error("❌ Insufficient token balance. You need to mint tokens first or reduce amounts.");
    console.log(`💡 Try minting tokens from the contract on Sepolia Etherscan`);
    process.exit(1);
  }

  // Approve tokens
  console.log(`✅ Approving ${symbolA} for router...`);
  const approveAHash = await walletClient.writeContract({
    address: tokenA,
    abi: ERC20_ABI,
    functionName: "approve",
    args: [SEPOLIA_ROUTER, amountADesired],
  });
  await publicClient.waitForTransactionReceipt({ hash: approveAHash });
  console.log(`✅ Approved ${symbolA}: ${approveAHash}`);

  console.log(`✅ Approving ${symbolB} for router...`);
  const approveBHash = await walletClient.writeContract({
    address: tokenB,
    abi: ERC20_ABI,
    functionName: "approve",
    args: [SEPOLIA_ROUTER, amountBDesired],
  });
  await publicClient.waitForTransactionReceipt({ hash: approveBHash });
  console.log(`✅ Approved ${symbolB}: ${approveBHash}`);

  // Add liquidity
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 600); // 10 minutes from now

  console.log(`🔄 Adding liquidity to ${symbolA}/${symbolB} pair...`);
  const addLiquidityHash = await walletClient.writeContract({
    address: SEPOLIA_ROUTER,
    abi: ROUTER_ABI,
    functionName: "addLiquidity",
    args: [
      tokenA,
      tokenB,
      amountADesired,
      amountBDesired,
      amountAMin,
      amountBMin,
      account.address,
      deadline,
    ],
  });

  console.log(`⏳ Transaction submitted: ${addLiquidityHash}`);
  
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: addLiquidityHash,
  });

  if (receipt.status === "success") {
    console.log(`✅ Liquidity added successfully!`);
    console.log(`🔗 Transaction: https://sepolia.etherscan.io/tx/${addLiquidityHash}`);
    console.log(`📊 Gas used: ${receipt.gasUsed.toString()}`);
  } else {
    console.log(`❌ Transaction failed`);
  }
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exitCode = 1;
});
