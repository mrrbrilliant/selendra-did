import React, { createContext, useRef, useState, useContext, useEffect } from "react";
import { ethers } from "ethers";
import WalletProvider, { WalletContext } from "./wallet";

import CTypeManagement from "../CreadentialManagement.json";

// @ts-ignore
export const ContractContext = createContext();
ContractContext.displayName = "ContractContext";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDR || "";

export default function ContractProvider({ children }) {
    const { plainWallet } = useContext(WalletContext);
    const [contract, setContract] = useState(null);

    useEffect(() => {
        if (plainWallet) {
            const _contract = new ethers.Contract(contractAddress, CTypeManagement.abi, plainWallet);
            setContract(_contract);
        }
    }, [plainWallet, setContract]);

    useEffect(() => {
        console.log(contract);
    }, [contract]);

    const value = {
        contract,
    };
    return <ContractContext.Provider value={value}>{children}</ContractContext.Provider>;
}
