import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";

import Navbar from "./navBar";

import { WalletContext } from "../contexts/wallet";
import Scanner from "./scan";

const Layout = ({ children }) => {
  const [openQr, setOpenQr] = useState(false);

  const { encryptedWallet, checkingAuth, wallet, toggleRequest, show } = useContext(WalletContext);

  function toggleQr() {
    setOpenQr(!openQr);
  }

  const unlock = useCallback(() => {
    if (encryptedWallet) {
      if (!checkingAuth && !wallet && !show) {
        toggleRequest();
      }
    }
  }, [encryptedWallet, checkingAuth, wallet, toggleRequest, show]);

  useEffect(() => {
    unlock();
  }, [unlock]);

  return (
    <div className="h-auto min-h-screen flex-1 ">
      <Navbar toggleQr={toggleQr} />
      <div className="px-72 mt-14">{children}</div>
      {openQr && <Scanner toggleQr={toggleQr} />}
    </div>
  );
};
export default Layout;
