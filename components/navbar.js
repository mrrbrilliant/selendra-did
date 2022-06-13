import React, { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { WalletContext } from "../contexts/wallet";

export default function NavBar() {
    const { lockWallet, forgetWallet } = useContext(WalletContext);
    const router = useRouter();

    return (
        <div className="navbar bg-base-300 rounded-xl flex place-items-center place-content-center sticky top-0">
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal p-0">
                    <li>
                        <Link href="/">
                            <a className={router.pathname == "/" ? "active" : ""}>Account</a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/digidocs">
                            <a className={router.pathname == "/digidocs" ? "active" : ""}>DigiDocs</a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/organizations">
                            <a className={router.pathname == "/organizations" ? "active" : ""}>Organizations</a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/verifications">
                            <a className={router.pathname == "/verifications" ? "active" : ""}>Verifications</a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/ctypes">
                            <a className={router.pathname == "/ctypes" ? "active" : ""}>Credentials</a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/ctypes/create">
                            <a className={router.pathname == "/ctypes/create" ? "active" : ""}>Create Credentials</a>
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="navbar-end">
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn m-1">
                        Leave
                    </label>
                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li onClick={lockWallet}>
                            <a>Lock</a>
                        </li>
                        <li onClick={forgetWallet}>
                            <a>Forget account</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
