// import { useEffect, useContext, useState } from "react";
// import { useRouter } from "next/router";
// import MainLayout from "../components/mainLayout";
// import { ContractContext } from "../contexts/contract";
// import { WalletContext } from "../contexts/wallet";

// function Home() {
//   const [num, setNum] = useState(-1);
//   const {
//     createOrg,
//     countOrgByUser,
//     deleteOrg,
//     organizationLists,
//     orgMeta,
//     organizationListsByUser,
//   } = useContext(ContractContext);

//   const router = useRouter();

//   async function count() {
//     const c = await countOrgByUser();
//     console.log(c);
//   }

//   return (
//     <div className="flex flex-row gap-4">
//       <button
//         className="btn"
//         onClick={() =>
//           createOrg({
//             name: "Nath Industry",
//             description: "Porn website",
//             orgUri: "https://nathindustry.com",
//           })
//         }
//       >
//         Create Org
//       </button>
//       <button className="btn" onClick={count}>
//         Count
//       </button>

//       <button className="btn" onClick={() => organizationListsByUser()}>
//         List
//       </button>
//       <input
//         className="input input-bordered"
//         type="text"
//         value={num}
//         onChange={(e) => setNum(e.target.value)}
//       />
//       <button className="btn" onClick={() => deleteOrg(num)}>
//         deleteOrg
//       </button>
//       <button className="btn" onClick={orgMeta}>
//         Show
//       </button>
//     </div>
//   );
// }

// Home.Layout = MainLayout;

// export default Home;

import React, { useContext } from "react";
import { WalletContext } from "../contexts/wallet";

const Index = () => {
  const { lockWallet, forgetWallet, plainWallet } = useContext(WalletContext);
  const publicKey = plainWallet?.address || "";
  const privateKey = plainWallet?.privateKey || "";
  return (
    <center>
      <div class="max-w-sm bg-white mt-52 rounded-lg border border-gray-200 shadow-md ">
        <div class="flex justify-end px-4 pt-4">
          <button
            id="dropdownButton"
            data-dropdown-toggle="dropdown"
            class="hidden sm:inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
            type="button"
          >
            <svg
              class="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
            </svg>
          </button>

          <div
            id="dropdown"
            class="hidden z-10 w-44 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700"
          >
            <ul class="py-1" aria-labelledby="dropdownButton">
              <li>
                <a
                  href="#"
                  class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Edit
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Export Data
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="block py-2 px-4 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Delete
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="flex flex-col items-center pb-10">
          <img
            class="mb-3 w-24 h-24 rounded-full shadow-lg"
            src="https://api.lorem.space/image/face?hash=33791"
            alt="Bonnie image"
          />
          <h5 class="mb-1 text-xl font-medium text-accent ">Lay Nath</h5>
          <h3 className="text-accent mt-3">
            SEL PubKey:{" "}
            <span className="text-primary">
              {publicKey.substring(0, 10)}...
            </span>
          </h3>

          <h3 className="text-accent mt-3">
            SEL PubKey:{" "}
            <span className="text-primary">
              {privateKey.substring(0, 10)}...
            </span>
          </h3>
        </div>
      </div>
    </center>
  );
};

export default Index;
