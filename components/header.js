import React, { useContext } from "react";
import Image from "next/image";
import { WalletContext } from "../contexts/wallet";

export default function Header() {
  const { lockWallet, forgetWallet, publicKey } = useContext(WalletContext);
  // const publicKey = wallet?.address || "";
  // const privateKey = wallet?.privateKey || "";

  return (
    <div className="w-full bg-gradient-to-r from-primary via-purple-500 to-secondary rounded-b-xl flex flex-col place-content-center place-items-center p-4">
      <div className="avatar">
        <div className="w-32 rounded-full bg-white bg-opacity-50 backdrop-blur-0 border-4 border-pink-200 border-opacity-90">
          <Image src={`https://avatars.dicebear.com/api/avataaars/${publicKey}.svg`} alt="" width={150} height={150} />
        </div>
      </div>
      <h1 className="p-2 text-xl font-bold text-primary-content">Lay Nath</h1>
      <h3 className="text-primary-content">SEL PubKey: {publicKey}</h3>
      {/* <h3 className="text-primary-content">SEL: {privateKey}</h3> */}
    </div>
  );
}
