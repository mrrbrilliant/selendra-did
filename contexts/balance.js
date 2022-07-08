import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { NetworkContext } from "./network";
import { WalletContext } from "./wallet";

export const BalanceContext = createContext();

export default function BalanceProvider({ children }) {
  const network = useContext(NetworkContext);
  const { publicKey } = useContext(WalletContext);

  const [balance, setBalance] = useState("0");

  useEffect(() => {
    if (network && publicKey) {
      network.getBalance(publicKey).then((balance) => {
        const balanceInEth = ethers.utils.formatEther(balance);
        setBalance(balanceInEth);
      });
    }
  }, [network, publicKey]);

  const value = {
    balance,
  };
  return <BalanceContext.Provider value={value}>{children}</BalanceContext.Provider>;
}
