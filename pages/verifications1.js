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
      <div className="grid grid-cols-4 gap-7 mt-4">
        {data.map((res) => {
          return (
            <div
              className={
                res.verify === true
                  ? "w-auto bg-white p-4 rounded-xl transform transition-all duration-300 border-r-4 border-green-800"
                  : "w-auto bg-white p-4 rounded-xl transform transition-all duration-300 border-r-4 border-r-red-800"
              }
            >
              <div className="flex items-center space-x-4">
                <img
                  className="flex-none w-14 h-14 rounded-full object-cover"
                  src={res.avatar}
                />
                <div>
                  <p className="font-bold">{res.name}</p>
                  <span className="text-xs bg-primarypink text-white font-bold px-2 py-0.5  rounded-xl">
                    {res.job}
                  </span>
                </div>
              </div>
              {/* <div className=" mt-5">
                <button className="bg-primary py-1 px-2 w-32 rounded-xl text-white font-bold">
                  Detail
                </button>
              </div> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Verifications1;
