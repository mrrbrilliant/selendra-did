import React, { useEffect, useState, useContext, useCallback } from "react";
import { QrReader } from "react-qr-reader";

import { useRouter } from "next/router";
import { WalletContext } from "../contexts/wallet";

export default function Scanner({ toggleQr }) {
  const { wallet, show, toggleRequest, publicKey } = useContext(WalletContext);
  const [data, setData] = useState({
    id: "",
    link: "",
  });
  const [emitLock, setEmitLock] = useState(false);
  const router = useRouter();

  const submit = useCallback(
    ({ id, signature, publicKey }) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        id,
        signature: `Web3 ${signature}`,
        publicKey,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(data.link, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          setEmitLock(false);
          toggleQr();
        })
        .catch((error) => console.log("error", error));
    },
    [data.link, setEmitLock, toggleQr]
  );

  const signMessage = useCallback(
    (msg) => {
      return wallet.signMessage(msg).then((msg) => msg);
    },
    [wallet]
  );

  function handleJson(result) {
    let valid = false;
    try {
      let json = JSON.parse(result);
      valid = true;
    } catch (e) {}

    return valid && setData(JSON.parse(result?.text));
  }

  useEffect(() => {
    if (data) {
      if (data.id && !emitLock) {
        setEmitLock(true);
        signMessage(data.id).then((msg) => {
          submit({ id: data.id, signature: msg, publicKey });
        });
      }
    }
  }, [data, emitLock, setEmitLock, signMessage, submit, publicKey]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    if (!wallet && !show) {
      toggleRequest();
    }
  }, [wallet, toggleRequest, show]);

  return (
    <div
      className="w-full h-full flex place-content-center place-items-center fixed top-0 left-0 backdrop-blur-md"
      onClick={toggleQr}
    >
      <div
        className="scanbox w-[350px] h-[350px] flex place-content-center place-items-center  rounded-3xl overflow-hidden border-8 bg-primary bg-opacity-30 border-primary border-opacity-30"
        onClick={(e) => e.stopPropagation()}
      >
        <QrReader
          constraints={{ facingMode: "environment" }}
          viewFinder={<ViewFinder />}
          onResult={(result, error) => {
            if (!!result) {
              handleJson(result);
            }

            if (!!error) {
              console.info(error);
            }
          }}
          className=" w-[500px] scale-[140%]"
        />
      </div>
    </div>
  );
}

const ViewFinder = () => (
  <>
    <svg
      width="50px"
      viewBox="0 0 100 100"
      style={{
        top: 0,
        left: 0,
        zIndex: 1,
        boxSizing: "border-box",
        border: "50px solid rgba(0, 0, 255, 0.5)",
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
    >
      <path fill="none" d="M13,0 L0,0 L0,13" stroke="rgba(0, 0, 255, 0.7)" strokeWidth="4" />
      <path fill="none" d="M0,87 L0,100 L13,100" stroke="rgba(0, 0, 255, 0.7)" strokeWidth="4" />
      <path fill="none" d="M87,100 L100,100 L100,87" stroke="rgba(0, 0, 255, 0.7)" strokeWidth="4" />
      <path fill="none" d="M100,13 L100,0 87,0" stroke="rgba(0, 0, 255, 0.7)" strokeWidth="4" />
    </svg>
  </>
);
