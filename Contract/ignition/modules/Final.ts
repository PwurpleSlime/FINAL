// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const FinalContractModule = buildModule("LockModule", (m) => {
  const FinalContract = m.contract("FinalContract", ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8", "John Doe"]);

  return { FinalContract };
});

export default FinalContractModule;
