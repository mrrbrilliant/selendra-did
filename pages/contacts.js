/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React from "react";

const data = [
  {
    name: "Afton Kessler",
    job: "Senior Response Director",
    favColor: "purple",
    avatar:
      "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/587.jpg",
    verify: true,
  },
  {
    name: "Melody McClure",
    job: "Central Configuration Supervisor",
    verify: true,
    favColor: "pink",
    avatar:
      "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/6.jpg",
  },
  {
    name: "Jannie Hickle",
    job: "Human Creative Facilitator",
    favColor: "white",
    avatar:
      "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1054.jpg",
  },
  {
    name: "Gwen Hyatt",
    job: "Legacy Program Specialist",
    favColor: "red",
    avatar:
      "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/674.jpg",
    verify: true,
  },
  {
    name: "Cornell Von",
    job: "Global Optimization Producer",
    favColor: "purple",
    avatar:
      "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/371.jpg",
    verify: true,
  },
  {
    name: "Nels Rempel",
    job: "Product Infrastructure Supervisor",
    favColor: "purple",
    avatar:
      "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/760.jpg",
    verify: false,
  },
];

const Verifications1 = () => {
  return (
    <div>
      <div className="grid grid-cols-4 gap-7 mt-4">
        {data.map((res, index) => {
          return (
            <div
              key={index}
              className="w-auto bg-base-100  rounded-xl transform transition-all duration-300 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex flex-col place-items-center place-content-center p-4">
                  <div className="p-2 rounded-full bg-gradient-radial from-amber-200 via-blue-200 to-sky-200">
                    <img
                      className="flex-none w-28 h-28 rounded-full object-cover "
                      src={res.avatar}
                      alt=""
                    />
                  </div>
                </div>
                <div className="text-center flex flex-col gap-1">
                  <p className="font-bold text-xl">{res.name}</p>
                  <span className="text-sm font-medium">{res.job}</span>
                  <p className=" divider text-sm mt-4 text-center font-semibold">
                    Specialities
                  </p>
                  <div className="card-actions  flex place-content-center">
                    <div className="badge badge-outline badge-warning badge-md">
                      PHP
                    </div>
                    <div className="badge badge-outline badge-warning badge-md">
                      Node JS
                    </div>
                    <div className="badge badge-outline badge-warning badge-md">
                      Solidity
                    </div>
                  </div>
                </div>
              </div>
              <div className=" mt-2">
                <Link href="/profile">
                  <button className="btn btn-block btn-info border-none rounded-t-none hover:text-white">
                    Detail
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Verifications1;
