import { network } from "hardhat";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Automatically loads the address of a deployed contract from Ignition artifacts
 * @param moduleName The name of the module (e.g., "WmonModule")
 * @param contractName The name of the contract (e.g., "WMON")
 * @returns The deployed address
 */
export async function getDeployedAddress(moduleName: string, contractName: string): Promise<`0x${string}`> {
    const { viem } = await network.connect();
    const publicClient = await viem.getPublicClient();
    const chainId = await publicClient.getChainId();

    const filePath = join(process.cwd(), "ignition", "deployments", `chain-${chainId}`, "deployed_addresses.json");

    try {
        const data = JSON.parse(readFileSync(filePath, "utf8"));
        const key = `${moduleName}#${contractName}`;
        const address = data[key];

        if (!address) {
            throw new Error(`Address not found for ${key} in ${filePath}`);
        }

        return address as `0x${string}`;
    } catch (error: any) {
        throw new Error(`Failed to load deployed addresses: ${error.message}`);
    }
}
