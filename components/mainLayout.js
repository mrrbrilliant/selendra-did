import NavBar from "./navbar";
import Header from "./header";
import { WalletContext } from "../contexts/wallet";
import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import NotificationManager from "./notifications/manager";

export default function MainLayout({ children }) {
  const { publicKey, encryptedWallet, checkingAuth } = useContext(WalletContext);
  const router = useRouter();

  return (
    <div className="w-full relative">
      <NotificationManager />
      <div className="w-full min-h-screen flex place-content-center">
        <div className="w-full min-h-full flex flex-col space-y-4 px-4">
          <div className="w-full min-h-screen bg-base-100 rounded-xl">
            {/* <NavBar /> */}
            {/* {children} */}
          </div>
        </div>
      </div>
    </div>
  );
}
