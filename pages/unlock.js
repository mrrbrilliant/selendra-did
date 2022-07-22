import { WalletContext } from "../contexts/wallet";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Unlock() {
  const { wallet, encryptedWallet, checkingAuth, unlockWallet } = useContext(WalletContext);
  const [password, setPassword] = useState("");
  const router = useRouter();

  function handleChange(e) {
    const { value } = e.target;
    setPassword(value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    unlockWallet({ password });
    router.back();
  }

  useEffect(() => {
    if (!checkingAuth) {
      if (!wallet && !encryptedWallet) {
        router.push("/createWallet");
        return;
      }
    }
  }, [checkingAuth, encryptedWallet, wallet, router]);

  return (
    <div className="w-full min-h-screen flex place-items-center place-content-center bg-base-300">
      <div className="card w-96 bg-base-100 shadow-xl p-6">
        <div className="card-body p-0">
          <a className="label font-bold">UNLOCK WALLET</a>
          <form className="form-control w-full" onSubmit={handleSubmit}>
            {/* password */}
            <label className="label">
              <span className="label-text">Password to unlock your wallet</span>
            </label>
            <input
              type="password"
              placeholder="xxxxxx"
              className="input input-bordered w-full"
              name="password"
              value={password}
              onChange={handleChange}
            />
            <label className="label mt-2">
              <input type="submit" value="UNLOCK" className="w-full btn btn-primary text-primary-content" />
            </label>
          </form>
        </div>
      </div>
    </div>
  );
}
