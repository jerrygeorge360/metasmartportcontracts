import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SepoliaDeploymentFeature = buildModule("SepoliaDeploymentFeature", (m) => {
    // Deploy Test Tokens 
    const testDAI = m.contract("TestDAI", []);
    const testUSDC = m.contract("TestUSDC", []);
    const testUSDT = m.contract("TestUSDT", []);
    const testWBTC = m.contract("TestWBTC", []);

    // Use existing Sepolia Uniswap V2 Router
    const sepoliaRouter = "0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3";

    // Deploy Portfolio Factory using the existing Sepolia router
    const portfolioFactory = m.contract("PortfolioFactory", [sepoliaRouter]);

    return {
        testDAI,
        testUSDC,
        testUSDT,
        testWBTC,
        portfolioFactory
    };
});

export default SepoliaDeploymentFeature;
