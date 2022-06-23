import React from "react";
import Link from "next/link";

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

const Profile = () => {
  return (
    <>
      <div className="md:grid md:grid-cols-3 gap-10 mt-10">
        <div className="md:col-span-1">
          <div className="bg-white p-4 rounded-xl">
            <img
              className="w-36 h-36 rounded-full border-gray-600 border-2"
              src="https://media-exp2.licdn.com/dms/image/C5603AQGp30P66iCXnA/profile-displayphoto-shrink_200_200/0/1628153693733?e=1661385600&v=beta&t=1R1QizZvXLugYKkUaSBU5SxGIQb5dQ9l2nUpBMoKwTo"
            />
            <p className="font-bold mt-2 ">Sam MuEL</p>
          </div>

          <div className="mt-4 bg-white p-4 rounded-xl">
            <h1 className="uppercase font-bold mb-3">Education</h1>
            <div className="text-sm font-medium mb-2 flex items-center space-x-2">
              <img
                className="rounded-full w-16 h-16"
                src="http://3.bp.blogspot.com/_oN2ovDH18dI/TNKOkWSZeVI/AAAAAAAAAJU/BMk5LbwR9a8/s1600/rupp.jpg"
              />

              <div className="text-sm font-medium pl-3">
                <p className=" font-bold">Royal University of PhnomPenh</p>
                <p className="text-md">Foundation degree, Computer Science</p>
                <span className="text-xs">2011-2021</span>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-white p-4 rounded-xl">
            <h1 className="uppercase font-bold mb-3">Skill</h1>
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

          <div className="mt-4 bg-white p-4 rounded-xl">
            <h1 className="uppercase font-bold mb-3">Experience</h1>
            <div>
              <ul class=" text-sm font-medium ">
                <li class="py-2 border-b border-gray-200 ">BlockChain Dev</li>
                <li class=" py-2 border-b border-gray-200 ">Fullstack Dev</li>
                <li class="py-2 border-b border-gray-200 ">Translater</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          {/* <img
            className="object-center w-full h-72 rounded"
            src="https://images.unsplash.com/photo-1655666581017-69571d99d6e6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
          /> */}
          <div>
            <div className="mb-8">
              <div>
                <h3 className="font-bold">My Organizations</h3>
              </div>
              <div className="grid grid-cols-3 gap-7 mt-4">
                {ownerdata.map((res) => {
                  return (
                    <div className="w-auto bg-white p-4 rounded-xl transform transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <img
                          className="flex-none w-14 h-14 rounded-full object-cover"
                          src={res.logo}
                        />
                        <p className="font-bold">{res.name}</p>
                      </div>
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
                          <p className="w-full bg-primary text-white font-semibold text-center p-2 rounded-md hover:bg-opacity-80">
                            Detail
                          </p>
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

export default Profile;
