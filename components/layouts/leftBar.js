import { useState } from "react";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "./navbar";

import { WalletContext } from "../../contexts/wallet";
import Rigthbar from "./rigthbar";

// import NotificationManager from "./notifications/manager";
const Sidebar = ({ children }) => {
  const { plainWallet, encryptedWallet, checkingAuth } =
    useContext(WalletContext);

  useEffect(() => {
    if (!checkingAuth) {
      if (!plainWallet) {
        router.push("/unlock");
        return;
      }
    }
  }, [checkingAuth, plainWallet, router]);

  useEffect(() => {
    if (!checkingAuth) {
      if (!encryptedWallet) {
        router.push("/createWallet");
        return;
      }
    }
  }, [checkingAuth, encryptedWallet, router]);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [newsBar, setNewsBar] = useState(false);
  const [blogsBar, setBlogsBar] = useState(false);

  return (
    <div className="h-screen flex-1 ">
      <Navbar />
      <div className="px-72 mt-14">{children}</div>
    </div>
  );
};
export default Sidebar;
