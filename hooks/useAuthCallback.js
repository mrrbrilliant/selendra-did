import React, { useCallback, useEffect } from "react";
import { WalletContext } from "../contexts/wallet";

export default function BtnWithAuth({ callback, children, className }) {
  const { setCb, toggleRequest, wallet } = React.useContext(WalletContext);
  const _callback = () => callback;

  const withCb = () => {
    if (!wallet) {
      setCb(_callback);
      toggleRequest();
      return;
    }
    callback();
  };

  return (
    <button onClick={withCb} className={className}>
      {children}
    </button>
  );
}
