import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TokensModule", (m) => {
    const dai = m.contract("TestDAI");
    const usdc = m.contract("TestUSDC");
    const usdt = m.contract("TestUSDT");
    const wbtc = m.contract("TestWBTC");

    return { dai, usdc, usdt, wbtc };
});
