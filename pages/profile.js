import React, { useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { v4 as uid } from "uuid";
import { ContractContext } from "../contexts/contract";
import { NotificationContext } from "../contexts/notification";

const Profile = () => {
  const { contractRO } = useContext(ContractContext);
  const { notify } = useContext(NotificationContext);
  // user identity
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const [userAddress, setUserAddress] = useState("");
  // user info
  const [isDocLoading, setIsDocLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [detail, setDetail] = useState(null);
  const [personalInfo, setPersonalInfo] = useState(null);

  const router = useRouter();

  const { user } = router.query || "";

  const toNumber = useCallback((number) => {
    const toUnit = ethers.utils.formatEther(number).toString();
    const roundedCount = Math.round(parseFloat(toUnit) * 10 ** 18);
    return roundedCount;
  }, []);

  const DocMeta = useCallback(
    (id) => {
      return contractRO._credentiallMetadata(id).then((tx, error) => {
        if (error) {
          const id = uid();
          notify({
            id,
            status: "error",
            name: "Error",
            message: `Failed to fetch document.\n${error.toString()}`,
          });
          return;
        }

        return tx;
      });
    },
    [contractRO, notify]
  );

  const getDocs = useCallback(
    (address) => {
      contractRO.credentialsList(address).then((data) => {
        if (data)
          Promise.all(
            data.map(async (docId) => {
              const row = await DocMeta(toNumber(docId));
              return { id: toNumber(docId), ...row };
            })
          ).then((orgs) => {
            // @ts-ignore
            setDocuments(orgs);
            setIsDocLoading(false);
          });
      });
    },
    [contractRO, DocMeta, toNumber, setDocuments, setIsDocLoading]
  );

  useEffect(() => {
    if (isCheckingUser && user) {
      const valid = ethers.utils.isAddress(user);
      if (valid) {
        setUserAddress(user);
      }
      setIsCheckingUser(false);
    }
  }, [user, isCheckingUser, setIsCheckingUser, setUserAddress]);

  useEffect(() => {
    if (!isCheckingUser && userAddress && contractRO) {
      getDocs(userAddress);
    }
  }, [isCheckingUser, userAddress, getDocs, contractRO]);

  useEffect(() => {
    if (documents && documents.length > 0) {
      const public_id = documents.filter((d) => d.name === "Public Identity");
      setDetail(public_id[0]);
    }
  }, [documents]);

  useEffect(() => {
    if (detail && detail.propertyURI) {
      fetch(detail.propertyURI)
        .then((res) => res.json())
        .then((data) => {
          setPersonalInfo(data);
        })
        .catch((error) => console.log(error));
    }
  }, [detail]);

  return (
    <>
      <div className="md:grid md:grid-cols-3 gap-10 mt-10">
        {!isCheckingUser && !userAddress && <div>User not found</div>}
        {!isCheckingUser && userAddress && personalInfo && <pre>{JSON.stringify(personalInfo, null, 4)}</pre>}
        {/* <div className="md:col-span-1">
          <div className="bg-base-100 p-4 rounded-xl">
            <img
              className="w-36 h-36 rounded-full border-gray-600 border-2"
              src="https://media-exp2.licdn.com/dms/image/C5603AQGp30P66iCXnA/profile-displayphoto-shrink_200_200/0/1628153693733?e=1661385600&v=beta&t=1R1QizZvXLugYKkUaSBU5SxGIQb5dQ9l2nUpBMoKwTo"
            />
            <p className="font-bold mt-2 ">Sam MuEL</p>
          </div>

          <div className="mt-4 bg-base-100 p-4 rounded-xl">
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

          <div className="mt-4 bg-base-100 p-4 rounded-xl">
            <h1 className="uppercase font-bold mb-3">Skill</h1>
            <div className="card-actions mt-4">
              <span className="text-center  px-2 py-1 bg-gray-700 bg-opacity-80 hover:bg-opacity-75 rounded-full text-sm font-semibold text-white">
                <span>PHP</span>
              </span>
              <span className="text-center  px-2 py-1 bg-gray-700 bg-opacity-80 hover:bg-opacity-75 rounded-full text-sm font-semibold text-white">
                <span>Node js</span>
              </span>
              <span className="text-center  px-2 py-1 bg-gray-700 bg-opacity-80 hover:bg-opacity-75 rounded-full text-sm font-semibold text-white">
                <span>Solidity</span>
              </span>
            </div>
          </div>

          <div className="mt-4 bg-base-100 p-4 rounded-xl">
            <h1 className="uppercase font-bold mb-3">Experience</h1>
            <div>
              <ul className=" text-sm font-medium ">
                <li className="py-2 border-b border-gray-200 ">BlockChain Dev</li>
                <li className=" py-2 border-b border-gray-200 ">Fullstack Dev</li>
                <li className="py-2 border-b border-gray-200 ">Translater</li>
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
              <div className="grid grid-cols-3 gap-7 mt-4">
                {ownerdata.map((res) => {
                  return (
                    <div className="w-auto bg-base-100 p-4 rounded-xl transform transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <img className="flex-none w-14 h-14 rounded-full object-cover" src={res.logo} />
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
        </div> */}
      </div>
    </>
  );
};

export default Profile;
