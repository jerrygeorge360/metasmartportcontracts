import { network } from "hardhat";
const { viem } = await network.connect();
import { parseEther, formatEther } from "viem";
import { getDeployedAddress } from "../08-helpers/addresses.js";

async function main() {
    // 1. Get the wallet client (the account that will sign)
    const [deployer] = await viem.getWalletClients();
    console.log(`Interacting with account: ${deployer.account.address}`);

    // 2. Get the contract instance
    // Automatically fetch the address from Ignition artifacts
    const WMON_ADDRESS = await getDeployedAddress("WmonModule", "WMON");
    const wmon = await viem.getContractAt("WMON", WMON_ADDRESS);

    // 3. Perform the interaction (Write)
    console.log("Depositing 1 ETH...");
    const hash = await wmon.write.deposit({
        value: parseEther("1")
    });

    // 4. Wait for the transaction to be mined
    const publicClient = await viem.getPublicClient();
    await publicClient.waitForTransactionReceipt({ hash });
    console.log("Deposit successful!");

    // 5. Query the result (Read)
    const balance = await wmon.read.balanceOf([deployer.account.address]);
    console.log(`New WMON Balance: ${formatEther(balance)}`);
}


// Standard Hardhat error handling pattern
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });