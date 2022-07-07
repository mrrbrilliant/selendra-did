import React from "react";
import Navbar from "./navbar";

const Rigthbar = () => {
  return (
    <>
      <div className="pr-7 pt-3">
        <div className="bg-white p-3 rounded h-44">
          <div className="relative h-32 w-80 ">
            <div className="group flex items-center">
              <img
                className="w-14 h-14 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                src="/images/den1.jpg"
                alt=""
              />
              <div className="ltr:ml-3 ml-4">
                <p className="text-sm font-medium text-slate-300 ">Sarim Sovanden</p>
                <p className="text-sm font-medium text-slate-500 ">FullStack Developer</p>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Rigthbar;
