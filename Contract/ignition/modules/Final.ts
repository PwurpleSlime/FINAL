// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const FinalContractModule = buildModule("LockModule", (m) => {
  const FinalContract = m.contract("FinalContract", ["John Doe", "1df5f48ea7a5029aebdacafc63713922be50eecebf9c5c1afbb4c59aa6f357de"]);

  return { FinalContract };
});

export default FinalContractModule;
