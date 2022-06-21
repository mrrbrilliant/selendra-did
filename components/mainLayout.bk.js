import NavBar from "./navbar";
import Header from "./header";
import { WalletContext } from "../contexts/wallet";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import NotificationManager from "./notifications/manager";
import Link from "next/link";
import Navbar from "./layouts/navbar";
export default function MainLayout({ children }) {
  const [newsBar, setNewsBar] = useState(false);

  const { plainWallet, encryptedWallet, checkingAuth } =
    useContext(WalletContext);
  const router = useRouter();

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

  return (
    // <div className="w-full relative">
    //   <NotificationManager />
    //   <div className="w-full min-h-screen flex place-content-center">
    //     <div className="w-full min-h-full flex flex-col space-y-4 px-4">
    //       <Header publicKey={plainWallet?.address || ""} />
    //       <div className="w-full min-h-screen bg-base-100 rounded-xl">
    //         <NavBar />
    //         {children}
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="flex">
      <div
        className={` ${
          open ? "w-72" : "w-20 "
        } bg-white h-screen p-5  pt-8 relative duration-300`}
      >
        <img
          src="/images/control.png"
          className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
         border-2 rounded-full  ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        />
        <div className="flex gap-x-4 items-center">
          <img
            // src="https://www.koompi.com/images/Koompi-white.png"
            src="/images/Koompi-WiFi-Icon.png"
            className={`cursor-pointer duration-500 w-10 ${
              open && "rotate-[360deg]"
            }`}
          />
          <h1
            className={`text-accent origin-left font-medium text-xl duration-200 ${
              !open && "scale-0"
            }`}
          >
            StudentId
          </h1>
        </div>

        <ul className="pt-6">
          <li>
            <Link href="/index1">
              <p
                className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-accent font-extrabold text-sm items-center gap-x-4
           ${
             router.pathname == "/index1"
               ? "bg-accent text-primarygray"
               : "text-accent hover:bg-gray-700 hover:text-primarygray"
           }  `}
              >
                <img src="/images/Chart_fill.png" />
                <span
                  className={`${!open && "hidden"} origin-left duration-200`}
                >
                  Dashboard
                </span>
              </p>
            </Link>
          </li>
          <li className="mt-9">
            <span
              onClick={() => setNewsBar(!newsBar)}
              className="flex cursor-pointer mt-9 items-center p-2 w-full text-sm  rounded-lg transition duration-75 group hover:bg-gray-700 hover:text-primarygray text-accent font-extrabold "
            >
              <img src="/images/Chart.png" />

              <span
                className={`${
                  !open && "hidden"
                } flex-1 ml-3 text-left whitespace-nowrap origin-left duration-200`}
              >
                Account
              </span>
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </span>
            <ul
              id="dropdown-example"
              className={`${
                !newsBar && "hidden"
              }  space-y-2 relative duration-300 pt-3`}
            >
              <li>
                <Link
                  href="/createorg"

                  // className="flex items-center p-2 pl-11 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                >
                  <p
                    className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-dark text-sm items-center gap-x-4  pl-11
           ${
             router.pathname == "/news"
               ? "bg-accent text-primarygray font-extrabold"
               : "text-accent hover:bg-gray-700 hover:text-primarygray font-extrabold"
           }  `}
                  >
                    {" "}
                    Create Org
                  </p>
                </Link>
              </li>
              <li>
                <Link href="/count">
                  <p
                    className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white  text-sm items-center gap-x-4 pl-11
           ${
             router.pathname == "/news/addnews"
               ? "bg-accent text-primarygray font-extrabold"
               : "text-accent hover:bg-gray-700 hover:text-primarygray font-extrabold"
           }  `}
                  >
                    Count
                  </p>
                </Link>
              </li>
            </ul>
          </li>
          {/* ====================blogs==================== */}
        </ul>
      </div>
      <div className="h-screen flex-1 p-7">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
