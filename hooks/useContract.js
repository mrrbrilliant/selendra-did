import React from "react";
import { ethers } from "ethers";

export default function useContract() {
    function readOnlyContract({ rpcEndpoint, contractAddress, contractABI }) {
        const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        return contract;
    }

    function readWriteContract({ rpcEndpoint, contractAddress, contractABI, privateKey }) {
        const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint);
        const wallet = new ethers.Wallet(privateKey, provider);
        const contract = new ethers.Contract(contractAddress, contractABI, wallet);
        return contract;
    }

    return { readOnlyContract, readWriteContract };
}
