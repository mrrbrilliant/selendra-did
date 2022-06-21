import React from "react";
import Link from "next/link";

const Detailorg = () => {
  const data = [
    {
      name: "Moeys Cambodia",
      des: "We will be using fixed and top-0 (optional) and left-0 (optional) utility classes for the sidebar. Besides, in order to prevent the content area from being obscured by the sidebar, we must give this content area the margin-left equal to the width of the sidebar.",
      link: "www.Moeyscambodia",
      logo: "/images/bg.jpg",
    },
    {
      name: "Moeys Cambodia",
      des: "We will be using fixed and top-0 (optional) and left-0 (optional) utility classes for the sidebar. Besides, in order to prevent the content area from being obscured by the sidebar, we must give this content area the margin-left equal to the width of the sidebar.",
      link: "www.Moeyscambodia",
      logo: "/images/bg.jpg",
    },
    {
      name: "Moeys Cambodia",
      des: "We will be using fixed and top-0 (optional) and left-0 (optional) utility classes for the sidebar. Besides, in order to prevent the content area from being obscured by the sidebar, we must give this content area the margin-left equal to the width of the sidebar.",
      link: "www.Moeyscambodia",
      logo: "/images/bg.jpg",
    },
    {
      name: "Moeys Cambodia",
      des: "We will be using fixed and top-0 (optional) and left-0 (optional) utility classes for the sidebar. Besides, in order to prevent the content area from being obscured by the sidebar, we must give this content area the margin-left equal to the width of the sidebar.",
      link: "www.Moeyscambodia",
      logo: "/images/bg.jpg",
    },
  ];
  return (
    <>
      <div className="grid grid-cols-2 gap-7 mt-3">
        <div class="relative overflow-hidden rounded-lg shadow-lg cursor-pointer h-52">
          <img
            className="object-center w-full"
            src="/images/bg.jpg"
            alt="Flower and sky"
          />
          <div className="h-full absolute top-0 left-0 px-6 py-4 bg-opacity-60 bg-accent">
            <h4 className="mb-3 text-2xl font-semibold tracking-tight text-white">
              Certification
            </h4>
            <p className="leading-normal text-white text-lg">
              Lorem ipsum dolor, sit amet cons ectetur adipis icing elit.
              Praesen tium, quibusdam facere quo laborum maiores sequi nam
              tenetur laud.
            </p>
            <button className=" w-32 mt-4 text-white font-medium p-2 rounded bg-primarypink bg-opacity-80">
              Create
            </button>
          </div>
        </div>
        <div class="relative overflow-hidden rounded-lg shadow-lg cursor-pointer h-52">
          <img
            className="object-cover w-full"
            src="/images/bg.jpg"
            alt="Flower and sky"
          />
          <div className="h-full absolute top-0 left-0 px-6 py-4 bg-opacity-60 bg-accent">
            <h4 className="mb-3 text-2xl font-semibold tracking-tight text-white">
              Certification
            </h4>
            <p className="leading-normal text-white text-lg">
              Lorem ipsum dolor, sit amet cons ectetur adipis icing elit.
              Praesen tium, quibusdam facere quo laborum maiores sequi nam
              tenetur laud.
            </p>
            <button className=" w-32 mt-4 text-white font-medium p-2 rounded bg-primarypink bg-opacity-80">
              Create
            </button>
          </div>
        </div>
      </div>
      <br />
      <div className="grid grid-cols-2 mt-3 gap-7">
        {data.map((res) => {
          return (
            <div className=" rounded-lg p-3  border-gray-100">
              <div className="grid md:grid-cols-5 gap-10">
                <div className="md:col-span-2">
                  <div
                    className="bg-no-repeat bg-center h-40 w-auto rounded"
                    style={{
                      backgroundImage: `url(${res.logo})`,
                    }}
                  ></div>
                  {/* <div>
                    <img className="w-full object-center h-36" src={res.logo} />
                  </div> */}
                </div>
                <div className="md:col-span-3">
                  <h4 className="text-xl font-semibold">{res.name}</h4>
                  <p className="text-lg mt-2">{res.des.substring(0, 100)}...</p>
                  <button className="p-2 text-white w-32 leading-none rounded font-bold mt-2 bg-primarypink hover:bg-opacity-75 text-xs uppercase">
                    <Link href="/ctypes/create1">Create</Link>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Detailorg;
