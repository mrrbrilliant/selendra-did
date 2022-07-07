import React, { createContext, useRef, useState, useContext, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import WalletProvider, { WalletContext } from "./wallet";

import CTypeManagement from "../CreadentialManagement.json";
import { NetworkContext } from "./network";

// @ts-ignore
export const ContractContext = createContext();
ContractContext.displayName = "ContractContext";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDR || "";

export default function ContractProvider({ children }) {
  const network = useContext(NetworkContext);
  const { wallet, publicKey } = useContext(WalletContext);
  const [contractRO, setContractRO] = useState(null);
  const [contractRW, setContractRW] = useState(null);

  useEffect(() => {
    if (wallet && !contractRW) {
      const _contract_rw = new ethers.Contract(contractAddress, CTypeManagement.abi, wallet);
      setContractRW(_contract_rw);
    }
  }, [wallet, setContractRW, contractRW]);

  useEffect(() => {
    if (publicKey && network && !contractRO) {
      const _contract_ro = new ethers.Contract(contractAddress, CTypeManagement.abi, network);
      setContractRO(_contract_ro);
    }
  }, [publicKey, network, setContractRO, contractRO]);

  useEffect(() => {
    if (contractRO) {
      console.log(contractRO);
    }
  }, [contractRO]);

  const value = {
    contractRO,
    contractRW,
  };
  return <ContractContext.Provider value={value}>{children}</ContractContext.Provider>;
}
