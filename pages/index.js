import React, { useContext, useEffect } from "react";
import { WalletContext } from "../contexts/wallet";
import Link from "next/link";
import { DataContext } from "../contexts/data";
import { BalanceContext } from "../contexts/balance";
import { VscLock } from "react-icons/vsc";

const ownerdata = [
  {
    name: "Lyly Food Industry Organization Ministry Of Industry And Handicrafts",
    des: "hello world",
    link: "www.Moeyscambodia",
    logo: "https://cdn.imgbin.com/11/10/25/imgbin-lyly-food-industry-organization-ministry-of-industry-and-handicrafts-sacha-inchi-xHCUjKKbf9nQ07XntD5287hQ8.jpg",
  },
  {
    name: "Royal Cambodian Armed Forces ",
    des: "hello world",
    link: "www.Moeyscambodia",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Royal_Cambodian_Armed_Forces_Logo.png",
  },
  {
    name: "Ministries and Institutions",
    des: "hello world",
    link: "www.Moeyscambodia",
    logo: "https://www.mfaic.gov.kh/ministriesLogo/uploads/F9433KJCI9II/Ministry%20of%20Post%20and%20Telecommunications.png",
  },
];
const Home = () => {
  const { balance } = useContext(BalanceContext);
  const { lockWallet, forgetWallet, wallet, publicKey, privateKey } = useContext(WalletContext);
  const { organizations } = useContext(DataContext);
  // const publicKey = wallet?.address || "";
  // const privateKey = wallet?.privateKey || "";

  useEffect(() => {
    console.log(organizations);
  }, [organizations]);

  return (
    <>
      <div className="md:grid md:grid-cols-3 gap-10 mt-10">
        <div className="md:col-span-1">
          <div className="bg-base-100 p-4 rounded-xl flex flex-col gap-2">
            <img
              className="w-28 h-28 rounded-full border-gray-600 border-2"
              src="https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/412.jpg"
              alt=""
            />
            <div>
              <p className="font-bold text-xl mb-2">Marcia Hudson III</p>
              <textarea className="w-full mb-2 text-sm resize-none font-mono" rows={1} value={publicKey} readOnly />
              {privateKey && (
                <textarea className="w-full mb-2 text-sm resize-none font-mono" value={privateKey} readOnly />
              )}

              <div className="flex space-x-2 justify-between">
                <div>Balance</div>
                <div className="text-sm flex place-content-center place-items-center space-x-2 font-mono">
                  {parseFloat(balance).toLocaleString("en-US", {
                    style: "currency",
                    currency: "SEL",
                    maximumFractionDigits: 4,
                  })}
                  {!privateKey && (
                    <span>
                      <VscLock fontSize={16} />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-base-100 p-4 rounded-xl">
            <h1 className="uppercase font-bold mb-3">Education</h1>
            <div className="text-sm font-medium mb-2 flex items-center space-x-2">
              <img
                className="rounded-full w-16 h-16"
                src="http://3.bp.blogspot.com/_oN2ovDH18dI/TNKOkWSZeVI/AAAAAAAAAJU/BMk5LbwR9a8/s1600/rupp.jpg"
                alt=""
              />

              <div className="text-sm font-medium pl-3">
                <p className=" font-bold">Royal University of PhnomPenh</p>
                <p className="text-md">Foundation degree, Computer Science</p>
                <span className="text-xs">2011-2021</span>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-base-100 p-4 rounded-xl">
            <h1 className="uppercase font-bold mb-3">Skill</h1>
            <div className="card-actions mt-4">
              <div className="badge badge-md">Dart</div>
              <div className="badge badge-md">Node JS</div>
              <div className="badge badge-md">Rust</div>
            </div>
          </div>

          <div className="mt-4 bg-base-100 p-4 rounded-xl">
            <h1 className="uppercase font-bold mb-3">Experience</h1>
            <div>
              <ul className=" text-sm font-medium ">
                <li className="py-2 border-b border-base-300 ">BlockChain Dev</li>
                <li className=" py-2 border-b border-base-300">Fullstack Dev</li>
                <li className="py-2 border-b border-base-300">Translater</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          <div>
            <div className="mb-8">
              <div>
                <h3 className="font-bold">My Organizations</h3>
              </div>
              <div className="grid grid-cols-3 gap-7 mt-4 place-content-start">
                {ownerdata.map((res, index) => {
                  return (
                    <div
                      key={index}
                      className="w-auto bg-base-100 p-4 rounded-xl transform transition-all duration-300 flex flex-col"
                    >
                      <div className="flex items-center space-x-4 flex-grow">
                        <img className="flex-none w-14 h-14 rounded-full object-cover" src={res.logo} alt="" />
                        <p className="font-bold">{res.name}</p>
                      </div>

                      <div className="divider">Statistic</div>
                      <br />
                      <div className="">
                        <div className="flex items-center space-x-4 mb-2">
                          <h1>Document types :</h1>
                          <p className="font-bold">80</p>
                        </div>

                        <div className="flex items-center space-x-4 mb-2">
                          <h1>Created documents :</h1>
                          <p className="font-bold">80</p>
                        </div>

                        <div className="flex items-center space-x-4">
                          <h1>Accounts :</h1>
                          <p className="font-bold">80</p>
                        </div>
                      </div>

                      <div className="mt-4 cursor-pointer justify-end">
                        <Link href="/detailorg">
                          <p className="w-full btn btn-primary">Detail</p>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
