import React from "react";
import Link from "next/link";

const Organizations1 = () => {
  const data = [
    {
      name: "Moeys Cambodia",
      des: "hello world",
      link: "www.Moeyscambodia",
      logo: "/images/moeyslogo.png",
    },
    {
      name: "Moeys Cambodia",
      des: "hello world",
      link: "www.Moeyscambodia",
      logo: "/images/moeyslogo.png",
    },
    {
      name: "Moeys Cambodia",
      des: "hello world",
      link: "www.Moeyscambodia",
      logo: "/images/moeyslogo.png",
    },
    {
      name: "Moeys Cambodia",
      des: "hello world",
      link: "www.Moeyscambodia",
      logo: "/images/moeyslogo.png",
    },
    {
      name: "Moeys Cambodia",
      des: "hello world",
      link: "www.Moeyscambodia",
      logo: "/images/moeyslogo.png",
    },
    {
      name: "Moeys Cambodia",
      des: "hello world",
      link: "www.Moeyscambodia",
      logo: "/images/moeyslogo.png",
    },
    {
      name: "Moeys Cambodia",
      des: "hello world",
      link: "www.Moeyscambodia",
      logo: "/images/moeyslogo.png",
    },
    {
      name: "Moeys Cambodia",
      des: "hello world",
      link: "www.Moeyscambodia",
      logo: "/images/moeyslogo.png",
    },
  ];
  return (
    <>
      <div className="grid grid-cols-4 gap-7 mt-3">
        {data.map((res) => {
          return (
            <div className="w-auto bg-white p-4 rounded-xl transform transition-all duration-300">
              <div className="flex items-center space-x-4">
                <img
                  className="flex-none w-14 h-14 rounded-full object-cover"
                  src={res.logo}
                />
                <p className="font-bold">{res.name}</p>
              </div>
              {/* <div className="mt-3">
                <p className="text-md text-gray-600">
                  {res.des.substring(0, 190)}...
                </p>
              </div> */}
              <div className="align-middle">
                <div className="py-2 flex items-center align-middle overflow-hidden">
                  <div className=" border-t w-full border-gray-300"></div>
                  <p className="mx-4 text-center">Report</p>
                  <div className="w-full border-t border-gray-300"></div>
                </div>
              </div>
              <br />
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

              <div className="mt-4 cursor-pointer">
                <Link href="/detailorg">
                  <p className="w-full bg-primary text-white font-semibold text-center p-2 rounded-md hover:bg-accent">
                    Detail
                  </p>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Organizations1;
