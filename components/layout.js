import { useState } from "react";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";

import Navbar from "./navBar";

import { WalletContext } from "../contexts/wallet";
import Scanner from "./scan";

const Layout = ({ children }) => {
  const router = useRouter();
  const [openQr, setOpenQr] = useState(false);

  // const { publicKey, encryptedWallet, checkingAuth } = useContext(WalletContext);

  function toggleQr() {
    setOpenQr(!openQr);
  }

  return (
    <div className="h-auto min-h-screen flex-1 ">
      <Navbar toggleQr={toggleQr} />
      <div className="px-72 mt-14">{children}</div>
      {openQr && <Scanner toggleQr={toggleQr} />}
    </div>
  );
};
export default Layout;
