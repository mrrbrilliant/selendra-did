import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { NetworkContext } from "./network";
import { WalletContext } from "./wallet";
import { NotificationContext } from "./notification";
import { v4 as uid } from "uuid";

export const BalanceContext = createContext();

export default function BalanceProvider({ children }) {
  const network = useContext(NetworkContext);
  const { publicKey, wallet } = useContext(WalletContext);
  const { notify, hide } = useContext(NotificationContext);

  const [balance, setBalance] = useState("0");

  async function transfer({ to, amount }) {
    const id_loading = uid();
    const id_success = uid();
    const id_error = uid();

    notify({ id: id_loading, status: "loading", name: "Transaction", message: `Transfering ${amount} SEL to ${to}` });

    try {
      const network_gas = await network.getGasPrice();
      const gas_price = ethers.utils.hexlify(network_gas);
      const gas_limit = "0x100000";

      const nonce = (await network.getTransactionCount(publicKey, "latest")) + 1;
      // const hexn = ethers.utils.hexValue(nonce);

      const transaction_config = {
        from: publicKey,
        to,
        value: ethers.utils.parseEther(amount),
        gasLimit: ethers.utils.hexlify(gas_limit),
        gasPrice: gas_price,
      };

      wallet.sendTransaction(transaction_config).then(async (tx, error) => {
        if (error) {
          hide(id_loading);
          notify({
            id: id_error,
            status: "error",
            name: "Transaction Failed",
            message: `Transaction failed. ${error.toString()}`,
          });
          return false;
        }

        await tx.wait();
        notify({
          id: id_success,
          status: "success",
          name: "Transaction Succress",
          message: `Transferred ${amount} SEL to ${to}`,
        });
        hide(id_loading);
      });

      return true;
    } catch (error) {
      hide(id_loading);
      notify({
        id: id_error,
        status: "error",
        name: "Transaction Failed",
        message: `Transaction failed. ${error.toString()}`,
      });
      return false;
    }
  }

  const fetchBalance = useCallback(() => {
    network.getBalance(publicKey).then((balance) => {
      const balanceInEth = ethers.utils.formatEther(balance);
      setBalance(balanceInEth);
    });
  }, [network, setBalance, publicKey]);

  useEffect(() => {
    if (network && publicKey) {
      network.getBalance(publicKey).then((balance) => {
        const balanceInEth = ethers.utils.formatEther(balance);
        setBalance(balanceInEth);
      });
    }
  }, [network, publicKey]);

  useEffect(() => {
    if (network && publicKey) {
      network.on("block", async (blockNumber) => {
        const blockData = await network.getBlockWithTransactions(blockNumber);
        const txs = blockData.transactions;
        const myTx = txs.filter((tx) => tx.to === publicKey || tx.from === publicKey);
        if (myTx.length > 0) {
          fetchBalance();
        }
      });
    }
  }, [network, publicKey, fetchBalance]);

  const value = {
    balance,
    transfer,
  };
  return <BalanceContext.Provider value={value}>{children}</BalanceContext.Provider>;
}
