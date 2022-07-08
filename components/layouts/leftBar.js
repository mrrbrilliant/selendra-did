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

  const { publicKey, encryptedWallet, checkingAuth } = useContext(WalletContext);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="h-auto min-h-screen flex-1 ">
      <Navbar />
      <div className="px-72 mt-14">{children}</div>
    </div>
  );
};
export default Sidebar;
