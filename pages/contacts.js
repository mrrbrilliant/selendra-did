import Link from "next/link";
import React from "react";

const data = [
  {
    name: "Vilson",
    job: "BlockChain Dev",
    favColor: "purple",
    avatar: "https://api.lorem.space/image/face?hash=33791",
    verify: true,
  },
  {
    name: "Chatha",
    job: "Fullstack Dev",
    verify: true,
    favColor: "pink",
    avatar: "https://api.lorem.space/image/face?hash=33791",
    verify: false,
  },
  {
    name: "Sovanden",
    job: "BlockChain Dev",
    favColor: "white",
    avatar: "https://api.lorem.space/image/face?hash=33791",
  },
  {
    name: "Thit",
    job: "Web Dev",
    favColor: "red",
    avatar: "https://api.lorem.space/image/face?hash=33791",
    verify: true,
  },
  {
    name: "Soklya",
    job: "Web Dev",
    favColor: "purple",
    avatar: "https://api.lorem.space/image/face?hash=33791",
    verify: true,
  },
  {
    name: "Seyha",
    job: "Mobile Dev",
    favColor: "purple",
    avatar: "https://api.lorem.space/image/face?hash=33791",
    verify: false,
  },
];

const Verifications1 = () => {
  return (
    <div>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-7 mt-4">
        {data.map((res) => {
          return (
            <div
              className="w-auto bg-white  rounded-xl transform transition-all duration-300 border-r-4"
              // className={
              //   res.verify === true
              //     ? "w-auto bg-white p-4 rounded-xl transform transition-all duration-300 border-r-4 "
              //     : "w-auto bg-white p-4 rounded-xl transform transition-all duration-300 border-r-4 "
              // }
            >
              <div className="p-4">
                <div className="flex flex-col items-center space-x-4">
                  <img
                    className="flex-none w-32 h-32 border-4 border-gray-400 rounded-full object-cover"
                    src={res.avatar}
                  />
                </div>
                <div className="text-center mt-3">
                  <p className="font-bold">{res.name}</p>
                  <span
                    className="text-sm font-medium"
                    // className="text-xs bg-primarypink text-white font-bold px-2 py-0.5  rounded-xl"
                  >
                    {res.job}
                  </span>
                </div>
                <div>
                  <p className="text-sm mt-1 text-center font-semibold ">
                    Skill
                  </p>
                  <div className="card-actions mt-4">
                    <span class="text-center  px-2 py-1 bg-gray-700 bg-opacity-80 hover:bg-opacity-75 rounded-full text-sm font-semibold text-white">
                      <span>PHP</span>
                    </span>
                    <span class="text-center  px-2 py-1 bg-gray-700 bg-opacity-80 hover:bg-opacity-75 rounded-full text-sm font-semibold text-white">
                      <span>Node js</span>
                    </span>
                    <span class="text-center  px-2 py-1 bg-gray-700 bg-opacity-80 hover:bg-opacity-75 rounded-full text-sm font-semibold text-white">
                      <span>Solidity</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className=" mt-2">
                <Link href="/profile">
                  <button className="uppercase hover:bg-primary text-accent py-4 px-2 w-full rounded-b-xl hover:text-white font-bold">
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
