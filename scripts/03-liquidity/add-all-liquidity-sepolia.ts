import { createPublicClient, createWalletClient, http, parseAbi, formatUnits, parseUnits, getContract } from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { config } from "dotenv";

config();

// Usage:
// npx hardhat run scripts/03-liquidity/add-all-liquidity-sepolia.ts --network sepolia

// Sepolia deployed addresses
const SEPOLIA_ROUTER = "0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3";

// Test token addresses (deployed on Sepolia)
const TEST_TOKENS = {
  DAI: { address: "0xAd22b4EC8cdd8A803d0052632566F6334A04F1F3", symbol: "DAI", decimals: 18 },
  USDC: { address: "0xcF9884827F587Cd9a0bDce33995B2333eE7e8285", symbol: "USDC", decimals: 6 },
  USDT: { address: "0x1861BB06286aAb0fDA903620844b4Aef4894b719", symbol: "USDT", decimals: 6 },
  WBTC: { address: "0x4267652AF61B4bE50A39e700ee2a160f42371f54", symbol: "WBTC", decimals: 8 },
};

// Liquidity amounts for each token (adjust these to your preference)
const LIQUIDITY_AMOUNTS = {
  DAI: "1000",   // 1000 DAI
  USDC: "1000",  // 1000 USDC  
  USDT: "1000",  // 1000 USDT
  WBTC: "10",    // 10 WBTC (more valuable)
};

const ERC20_ABI = parseAbi([
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
]);

const ROUTER_ABI = parseAbi([
  "function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity)",
]);

async function main() {
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

  console.log(`🚀 Adding liquidity for ALL token pairs on Sepolia`);
  console.log(`📝 Using account: ${account.address}`);
  console.log(`🏦 Router: ${SEPOLIA_ROUTER}`);
  console.log(`\n📊 Available tokens:`);
  
  Object.entries(TEST_TOKENS).forEach(([key, token]) => {
    console.log(`   ${token.symbol}: ${token.address}`);
  });

  // Generate all possible pairs
  const tokens = Object.values(TEST_TOKENS);
  const pairs: Array<[typeof tokens[0], typeof tokens[0]]> = [];
  
  for (let i = 0; i < tokens.length; i++) {
    for (let j = i + 1; j < tokens.length; j++) {
      pairs.push([tokens[i], tokens[j]]);
    }
  }

  console.log(`\n💧 Will create ${pairs.length} liquidity pairs:`);
  pairs.forEach(([tokenA, tokenB], index) => {
    console.log(`   ${index + 1}. ${tokenA.symbol}/${tokenB.symbol}`);
  });

  // Check balances first
  console.log(`\n💳 Checking token balances...`);
  for (const [key, token] of Object.entries(TEST_TOKENS)) {
    const tokenContract = getContract({
      address: token.address as `0x${string}`,
      abi: ERC20_ABI,
      client: publicClient,
    });

    const balance = await tokenContract.read.balanceOf([account.address]);
    const formattedBalance = formatUnits(balance, token.decimals);
    console.log(`   ${token.symbol}: ${formattedBalance}`);

    const requiredAmount = LIQUIDITY_AMOUNTS[key as keyof typeof LIQUIDITY_AMOUNTS];
    const requiredWei = parseUnits(requiredAmount, token.decimals);
    
    if (balance < requiredWei) {
      console.error(`❌ Insufficient ${token.symbol} balance. Need ${requiredAmount}, have ${formattedBalance}`);
      console.log(`💡 Visit https://sepolia.etherscan.io/address/${token.address}#writeContract to mint tokens`);
      process.exit(1);
    }
  }

  console.log(`✅ All balances sufficient!`);

  // Approve all tokens for the router
  console.log(`\n🔓 Approving all tokens for router...`);
  for (const [key, token] of Object.entries(TEST_TOKENS)) {
    const amount = parseUnits(LIQUIDITY_AMOUNTS[key as keyof typeof LIQUIDITY_AMOUNTS], token.decimals);
    
    // Check if already approved
    const tokenContract = getContract({
      address: token.address as `0x${string}`,
      abi: ERC20_ABI,
      client: publicClient,
    });

    const currentAllowance = await tokenContract.read.allowance([account.address, SEPOLIA_ROUTER]);
    
    if (currentAllowance < amount) {
      console.log(`   Approving ${token.symbol}...`);
      const approveHash = await walletClient.writeContract({
        address: token.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [SEPOLIA_ROUTER, amount * 10n], // Approve extra for all pairs
      });
      
      // Wait with timeout
      await publicClient.waitForTransactionReceipt({ 
        hash: approveHash,
        timeout: 300_000, // 5 minutes
        pollingInterval: 5_000, // Check every 5 seconds
      });
      console.log(`   ✅ ${token.symbol} approved`);
    } else {
      console.log(`   ✅ ${token.symbol} already approved`);
    }
  }

  // Add liquidity for each pair
  console.log(`\n💧 Adding liquidity for all pairs...`);
  const results = [];

  for (let i = 0; i < pairs.length; i++) {
    const [tokenA, tokenB] = pairs[i];
    const pairNumber = i + 1;
    
    console.log(`\n${pairNumber}/${pairs.length}. Adding ${tokenA.symbol}/${tokenB.symbol} liquidity...`);

    const amountAStr = LIQUIDITY_AMOUNTS[Object.keys(TEST_TOKENS).find(k => TEST_TOKENS[k as keyof typeof TEST_TOKENS].address === tokenA.address) as keyof typeof LIQUIDITY_AMOUNTS];
    const amountBStr = LIQUIDITY_AMOUNTS[Object.keys(TEST_TOKENS).find(k => TEST_TOKENS[k as keyof typeof TEST_TOKENS].address === tokenB.address) as keyof typeof LIQUIDITY_AMOUNTS];

    const amountADesired = parseUnits(amountAStr, tokenA.decimals);
    const amountBDesired = parseUnits(amountBStr, tokenB.decimals);
    
    // 5% slippage tolerance
    const amountAMin = (amountADesired * 95n) / 100n;
    const amountBMin = (amountBDesired * 95n) / 100n;

    console.log(`   💰 ${amountAStr} ${tokenA.symbol} + ${amountBStr} ${tokenB.symbol}`);

    try {
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 600); // 10 minutes

      const addLiquidityHash = await walletClient.writeContract({
        address: SEPOLIA_ROUTER,
        abi: ROUTER_ABI,
        functionName: "addLiquidity",
        args: [
          tokenA.address,
          tokenB.address,
          amountADesired,
          amountBDesired,
          amountAMin,
          amountBMin,
          account.address,
          deadline,
        ],
      });

      console.log(`   ⏳ Transaction: ${addLiquidityHash}`);
      
      // Wait for transaction with longer timeout (5 minutes)
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: addLiquidityHash,
        timeout: 300_000, // 5 minutes timeout
        pollingInterval: 5_000, // Check every 5 seconds
      });

      if (receipt.status === "success") {
        console.log(`   ✅ ${tokenA.symbol}/${tokenB.symbol} liquidity added successfully!`);
        console.log(`   🔗 https://sepolia.etherscan.io/tx/${addLiquidityHash}`);
        results.push({
          pair: `${tokenA.symbol}/${tokenB.symbol}`,
          status: "success",
          tx: addLiquidityHash,
          gasUsed: receipt.gasUsed.toString(),
        });
      } else {
        console.log(`   ❌ ${tokenA.symbol}/${tokenB.symbol} transaction failed`);
        results.push({
          pair: `${tokenA.symbol}/${tokenB.symbol}`,
          status: "failed",
          tx: addLiquidityHash,
        });
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes("Timed out while waiting")) {
        console.error(`   ⏰ ${tokenA.symbol}/${tokenB.symbol} transaction timed out (but may still succeed)`);
        console.log(`   🔗 Check manually: https://sepolia.etherscan.io/tx/${error.message.match(/0x[a-fA-F0-9]{64}/)?.[0]}`);
        results.push({
          pair: `${tokenA.symbol}/${tokenB.symbol}`,
          status: "timeout",
          error: "Transaction timeout - check manually",
        });
      } else {
        console.error(`   ❌ Error adding ${tokenA.symbol}/${tokenB.symbol}:`, error);
        results.push({
          pair: `${tokenA.symbol}/${tokenB.symbol}`,
          status: "error",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Longer delay between transactions to avoid network congestion
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  // Summary
  console.log(`\n🎉 LIQUIDITY ADDITION COMPLETE!`);
  console.log(`\n📊 Summary:`);
  
  const successful = results.filter(r => r.status === "success");
  const failed = results.filter(r => r.status !== "success");
  
  console.log(`   ✅ Successful: ${successful.length}/${results.length}`);
  console.log(`   ❌ Failed: ${failed.length}/${results.length}`);

  if (successful.length > 0) {
    console.log(`\n✅ Successfully created liquidity for:`);
    successful.forEach(result => {
      console.log(`   • ${result.pair} - Gas: ${result.gasUsed}`);
    });
  }

  if (failed.length > 0) {
    console.log(`\n❌ Failed pairs:`);
    failed.forEach(result => {
      console.log(`   • ${result.pair} - ${result.status}`);
    });
  }

  console.log(`\n🚀 Your tokens now have comprehensive liquidity across ALL pairs!`);
  console.log(`💡 You can now test swaps, portfolio creation, and all DeFi operations.`);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exitCode = 1;
});
