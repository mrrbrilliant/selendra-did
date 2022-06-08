import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";

// @ts-ignore
export const NetworkContext = createContext();
NetworkContext.displayName = "NetworkContext";

const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_WSS_ADDRESS);

export default function NetworkProvider({ children }) {
    const [network] = useState(provider);

    return <NetworkContext.Provider value={network}>{children}</NetworkContext.Provider>;
}
