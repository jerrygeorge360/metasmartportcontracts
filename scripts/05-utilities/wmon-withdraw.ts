import { network } from "hardhat";
const { viem } = await network.connect();
import { parseEther, formatEther } from "viem";
import { getDeployedAddress } from "../08-helpers/addresses.js";

async function main() {
    // 1. Get the wallet client (the account that will sign)
    const [deployer] = await viem.getWalletClients();
    console.log(`Interacting with account: ${deployer.account.address}`);

    // 2. Get the contract instance
    const WMON_ADDRESS = await getDeployedAddress("WmonModule", "WMON");
    const wmon = await viem.getContractAt("WMON", WMON_ADDRESS);

    // 3. Check current WMON balance
    const currentBalance = await wmon.read.balanceOf([deployer.account.address]);
    console.log(`Current WMON Balance: ${formatEther(currentBalance)}`);

    if (currentBalance === 0n) {
        console.log("No WMON to withdraw!");
        return;
    }

    // 4. Withdraw amount (you can modify this)
    const withdrawAmount = parseEther("0.5"); // Withdraw 0.5 WMON
    
    if (withdrawAmount > currentBalance) {
        console.log(`Requested amount (${formatEther(withdrawAmount)}) exceeds balance!`);
        console.log(`Withdrawing entire balance instead...`);
        
        // Withdraw all
        const hash = await wmon.write.withdraw([currentBalance]);
        
        const publicClient = await viem.getPublicClient();
        await publicClient.waitForTransactionReceipt({ hash });
        console.log(`Withdrew all WMON: ${formatEther(currentBalance)}`);
    } else {
        // Withdraw specified amount
        console.log(`Withdrawing ${formatEther(withdrawAmount)} WMON...`);
        const hash = await wmon.write.withdraw([withdrawAmount]);
        
        const publicClient = await viem.getPublicClient();
        await publicClient.waitForTransactionReceipt({ hash });
        console.log("Withdraw successful!");
    }

    // 5. Check new balance
    const newBalance = await wmon.read.balanceOf([deployer.account.address]);
    console.log(`New WMON Balance: ${formatEther(newBalance)}`);
}

// Standard Hardhat error handling pattern
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
