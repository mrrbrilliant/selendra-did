/* eslint-disable @next/next/no-img-element */
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import MainLayout from "../components/mainLayout";
import { DataContext } from "../contexts/data";
import Modal from "../components/modal";

import { ethers } from "ethers";
import Link from "next/link";

import { VscVerified, VscUnverified } from "react-icons/vsc";
import { WalletContext } from "../contexts/wallet";
import BtnWithAuth from "../hooks/useAuthCallback";

const initialState = {
  name: "",
  type: "",
  docURL: "",
  docHash: "",
  ownerId: "",
};

function Claims() {
  const { isDocLoading, documents } = useContext(DataContext);
  const [isCheckingUnverifiedDocs, setIsCheckUnverifiedDocs] = useState(true);
  const [unVerifiedDocs, setUnverifiedDocs] = useState([]);
  const { wallet, checkingAuth } = useContext(WalletContext);

  const checkUnverifiedDocs = async () => {
    const signer = new ethers.Wallet(wallet.privateKey);
    const signature = await signer.signMessage("decentralized_identity");

    let myHeaders = new Headers();
    myHeaders.append("Authorization", signature);
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    return fetch("https://attestation.koompi.org/claims/user", requestOptions)
      .then((response) => response.json())
      .then((result) => result)
      .catch((error) => error);
  };

  useEffect(() => {
    if (!checkingAuth && wallet) {
      if (isCheckingUnverifiedDocs && wallet.privateKey) {
        checkUnverifiedDocs().then((docs) => {
          setUnverifiedDocs(docs);
          setIsCheckUnverifiedDocs(false);
        });
      }
    }
  }, [isCheckingUnverifiedDocs, checkUnverifiedDocs, wallet, checkingAuth]);
  return (
    <div className="-mt-10">
      <div>
        <div className="grid grid-cols-2 mt-6 gap-6 ">
          {documents &&
            documents.length > 0 &&
            documents.map((res, index) => {
              return <DocumentCard key={index} res={res} />;
            })}
        </div>
        {unVerifiedDocs.length > 0 && (
          <>
            <h1>Unverified</h1>
            <div className="grid grid-cols-2 mt-6 gap-6 ">
              {unVerifiedDocs &&
                unVerifiedDocs.length > 0 &&
                unVerifiedDocs.map((res, index) => {
                  return <DocumentCard key={index} res={res} />;
                })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Claims;

const DocumentCard = ({ res }) => {
  const { organizations, isOrgLoading, credentialTypes, transferDocument } = useContext(DataContext);

  const [typeDetail, setTypeDetail] = useState();
  const [orgDetail, setOrgDetail] = useState();
  const [docDetail, setDocDetail] = useState();
  const [cType, setCType] = useState();

  const [transferTo, setTransferTo] = useState("");
  const [openTransfer, setOpenTransfer] = useState(false);

  function toNumber(number) {
    const toUnit = ethers.utils.formatEther(number).toString();
    const roundedCount = Math.round(parseFloat(toUnit) * 10 ** 18);
    return roundedCount;
  }

  async function getCType() {
    const id = toNumber(res.ctypeId);
    const ct = credentialTypes.filter((c) => c.id === id)[0];

    if (!ct) return;

    const orgId = toNumber(ct.orgId);

    const ctDetail = await fetch(ct.propertiesURI)
      .then((res) => res.json())
      .then((data) => data)
      .catch((error) => console.log(error));

    const doc = await fetch(res.propertyURI)
      .then((res) => res.json())
      .then((data) => data)
      .catch((error) => console.log(error));

    const org = organizations.filter((o) => toNumber(o.id) === orgId)[0];

    setTypeDetail(ctDetail);
    setOrgDetail(org);
    setDocDetail(doc);
    setCType(ct);
  }

  useEffect(() => {
    getCType();
  }, []);

  useEffect(() => {
    if (typeDetail) {
      console.log("typeDetail", typeDetail);
    }
  }, [typeDetail]);

  useEffect(() => {
    if (docDetail) {
      console.log("docDetail", docDetail);
    }
  }, [docDetail]);

  useEffect(() => {
    if (cType) {
      console.log("cType", cType);
    }
  }, [cType]);

  useEffect(() => {
    console.log("res", res);
  }, [res]);

  return (
    <div className=" rounded-lg p-6  border-gray-100 bg-white relative overflow-hidden">
      <div className="flex flex-col place-items-start place-content-start">
        {typeDetail && typeDetail.images && (
          <div className="w-full  h-max flex place-content-center place-items-center mb-4">
            <img className="w-auto max-h-64" src={typeDetail.images[0]} alt="" />
          </div>
        )}
        <div className="w-full flex flex-col flex-grow space-y-2">
          <h4 className="text-2xl font-semibold">{res.name}</h4>
          <Badge status={res.status} />
          <div className="font-normal text-sm">BY: {orgDetail?.name}</div>
          <textarea className="w-full mt-2 focus:outline-none resize-none" readOnly value={res.propertyHash} />

          {openTransfer && (
            <>
              <textarea
                className="w-full textarea textarea-error mt-2 focus:outline-none resize-none"
                placeholder="Transfer to"
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
              />
              <div className="flex space-x-2">
                <button
                  className="p-2 text-white w-32 leading-none rounded font-bold mt-2 bg-primarypink hover:bg-opacity-75 text-xs uppercase"
                  onClick={(e) => {
                    setTransferTo("");
                    setOpenTransfer(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="p-2 text-white w-32 leading-none rounded font-bold mt-2 bg-primarypink hover:bg-opacity-75 text-xs uppercase"
                  onClick={() => {
                    transferDocument({ credentialid: res.id, to: transferTo });
                    setTransferTo("");
                    setOpenTransfer(false);
                  }}
                >
                  Confirm
                </button>
              </div>
            </>
          )}
          {!openTransfer && (
            <div className="flex space-x-2">
              <button className="p-2 text-white w-32 leading-none rounded font-bold mt-2 bg-primarypink hover:bg-opacity-75 text-xs uppercase">
                Detail
              </button>
              {cType && cType.transferable && (
                <BtnWithAuth
                  className="p-2 text-white w-32 leading-none rounded font-bold mt-2 bg-primarypink hover:bg-opacity-75 text-xs uppercase"
                  callback={() => {
                    setOpenTransfer(true);
                  }}
                >
                  Transfer
                </BtnWithAuth>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function Badge({ status }) {
  if (status) {
    return (
      <div className="badge badge-success gap-2 p-4 pr-8 absolute -right-4 top-4 font-bold">
        <VscVerified size={24} />
        Valid
      </div>
    );
  }

  return (
    <div className="badge badge-error gap-2 p-4 pr-8 absolute -right-4 top-4 font-bold">
      <VscUnverified size={24} />
      Invalid
    </div>
  );
}
