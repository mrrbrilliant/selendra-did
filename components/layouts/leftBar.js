import { useState } from "react";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "./navbar";

import { WalletContext } from "../../contexts/wallet";
import Rigthbar from "./rigthbar";

import NotificationManager from "../notifications/manager";

const Sidebar = ({ children }) => {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [newsBar, setNewsBar] = useState(false);
  const [blogsBar, setBlogsBar] = useState(false);

  const { publicKey, encryptedWallet, checkingAuth } =
    useContext(WalletContext);

  // useEffect(() => {
  //   if (!checkingAuth) {
  //     if (!publicKey && !encryptedWallet) {
  //       router.push("/unlock");
  //       return;
  //     }
  //   }
  // }, [checkingAuth, publicKey, encryptedWallet, router]);

  // useEffect(() => {
  //   if (!checkingAuth) {
  //     if (!encryptedWallet && !publicKey) {
  //       router.push("/createWallet");
  //       return;
  //     }
  //   }
  // }, [checkingAuth, encryptedWallet, router]);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div>
      <Navbar />
      <div className="px-3 xl:px-72 md:px-6 mt-14">{children}</div>
    </div>
  );
};
export default Sidebar;
