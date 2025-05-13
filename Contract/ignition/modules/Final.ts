// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const FinalContractModule = buildModule("LockModule", (m) => {
  const FinalContract = m.contract("FinalContract", ["John Doe", "TestHash"]);

  return { FinalContract };
});

export default FinalContractModule;
