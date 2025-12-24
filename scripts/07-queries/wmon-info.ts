import { network } from "hardhat";
const { viem } = await network.connect();
import { formatEther } from "viem";
import { getDeployedAddress } from "../08-helpers/addresses.js";

async function main() {
    const [deployer] = await viem.getWalletClients();
    const publicClient = await viem.getPublicClient();

    // 1. Get WMON Address
    const WMON_ADDRESS = await getDeployedAddress("WmonModule", "WMON");
    const wmon = await viem.getContractAt("WMON", WMON_ADDRESS);

    console.log(`--- WMON Info (${WMON_ADDRESS}) ---`);

    // 2. Query Total Supply (Total ETH locked)
    const totalSupply = await wmon.read.totalSupply();
    console.log(`Total Supply: ${formatEther(totalSupply)} WMON`);

    // 3. Query User Balance
    const balance = await wmon.read.balanceOf([deployer.account.address]);
    console.log(`Your Balance: ${formatEther(balance)} WMON`);

    // 4. Query Native ETH Balance (for comparison)
    const ethBalance = await publicClient.getBalance({ address: deployer.account.address });
    console.log(`Your ETH Balance: ${formatEther(ethBalance)} ETH`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
