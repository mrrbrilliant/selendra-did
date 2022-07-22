import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import Navbar from "./navBar";

import { WalletContext } from "../contexts/wallet";
import Scanner from "./scan";

const Layout = ({ children }) => {
  const [openQr, setOpenQr] = useState(false);
  const { encryptedWallet, checkingAuth, wallet, toggleRequest, show } = useContext(WalletContext);
  const router = useRouter();
  const path = router.pathname;

  function toggleQr() {
    setOpenQr(!openQr);
  }

  const unlock = useCallback(() => {
    if (path !== "/profile") {
      if (encryptedWallet) {
        if (!checkingAuth && !wallet && !show) {
          toggleRequest();
        }
      }
    }
  }, [encryptedWallet, checkingAuth, wallet, toggleRequest, show, path]);

  useEffect(() => {
    unlock();
  }, [unlock]);

  return (
    <div className="h-auto min-h-screen relative">
      <Navbar toggleQr={toggleQr} />
      <div className="md:px-6 lg:px-[10vw] xl:px-[15vw] py-6 z-0">{children}</div>
      {openQr && <Scanner toggleQr={toggleQr} />}
    </div>
  );
};
export default Layout;
