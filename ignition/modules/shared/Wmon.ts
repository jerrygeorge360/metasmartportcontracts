import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("WmonModule", (m) => {
  const wmon = m.contract("WMON");
  m.staticCall(wmon, "totalSupply");
  m.staticCall(wmon, "name");
  m.staticCall(wmon, "symbol");
  m.staticCall(wmon, "decimals");

  return { wmon };
});
