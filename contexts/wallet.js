import { createContext, useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { NetworkContext } from "./network";
// @ts-ignore
export const WalletContext = createContext();
WalletContext.displayName = "WalletContext";

export default function WalletProvider({ children }) {
    const provider = useContext(NetworkContext);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [encryptedWallet, setEncryptedWallet] = useState("");
    const [plainWallet, setPlainWallet] = useState(null);
    const router = useRouter();

    function createWallet({ password, mnemonic }) {
        const wallet = ethers.Wallet.fromMnemonic(mnemonic).connect(provider);
        // @ts-ignore
        setPlainWallet(wallet);

        wallet
            .encrypt(password, {
                scrypt: {
                    N: 4096,
                },
            })
            .then((encryptedWallet) => {
                window.localStorage.setItem("encryptedWallet", encryptedWallet);
                setEncryptedWallet(encryptedWallet);
                router.push("/");
            });
    }

    function unlockWallet({ password }) {
        try {
            const wallet = ethers.Wallet.fromEncryptedJsonSync(encryptedWallet, password).connect(provider);
            // @ts-ignore
            setPlainWallet(wallet);
        } catch (error) {
            console.log(error);
        }
    }

    function lockWallet() {
        window.location.replace("/unlock");
    }

    function forgetWallet() {
        window.localStorage.removeItem("encryptedWallet");
        window.location.replace("/createWallet");
    }

    useEffect(() => {
        const initalEncryptedWallet = window.localStorage.getItem("encryptedWallet") || null;
        if (initalEncryptedWallet) {
            setEncryptedWallet(initalEncryptedWallet);
        }
        setCheckingAuth(false);
    }, []);
    const value = {
        plainWallet,
        encryptedWallet,
        checkingAuth,
        createWallet,
        unlockWallet,
        lockWallet,
        forgetWallet,
    };
    return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}
