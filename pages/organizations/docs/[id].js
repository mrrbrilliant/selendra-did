/* eslint-disable @next/next/no-img-element */
import React, { useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { DataContext } from "../../../contexts/data";
import { ContractContext } from "../../../contexts/contract";
import { WalletContext } from "../../../contexts/wallet";
import { ethers } from "ethers";
import { VscVerified, VscUnverified } from "react-icons/vsc";
import Link from "next/link";
import Badge from "../../../components/badge";

export default function CreateDoc() {
  const { contractRO, contractRW } = useContext(ContractContext);
  const { usersByCTypes } = useContext(DataContext);
  const [isLoading, setIsLoading] = useState(true);
  const [allDocsByCtype, setAllDocsByCtype] = useState([]);
  const [type, setType] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  function toNumber(number) {
    const toUnit = ethers.utils.formatEther(number).toString();
    const roundedCount = Math.round(parseFloat(toUnit) * 10 ** 18);
    return roundedCount;
  }

  useEffect(() => {
    console.log("id", id);
  }, [id]);

  useEffect(() => {
    if (contractRO && id) {
      if (isLoading) {
        usersByCTypes(id).then((docs) => {
          setAllDocsByCtype(docs);
          setIsLoading(false);
        });
      }
    }
  }, [isLoading, setIsLoading, setAllDocsByCtype, usersByCTypes, id, contractRO]);

  useEffect(() => {
    if (allDocsByCtype && !type) {
      const thisType = allDocsByCtype.filter((c) => toNumber(c.ctypeId) === parseInt(id));
      setType(thisType[0]);
    }
  }, [allDocsByCtype, toNumber, id, type]);

  return (
    <div>
      <h1 className="text-3xl font-bold my-6">{type?.name}</h1>
      <div className="grid grid-cols-1 gap-6">
        {allDocsByCtype.map((res, index) => (
          <DocumentCard key={index} res={res} />
        ))}
      </div>
    </div>
  );
}

const DocumentCard = ({ res }) => {
  const { organizations, isOrgLoading, credentialTypes, createDocument, toggleRevokeDocument } =
    React.useContext(DataContext);
  const { wallet } = useContext(WalletContext);

  const [typeDetail, setTypeDetail] = useState(null);
  const [orgDetail, setOrgDetail] = useState(null);
  const [docDetail, setDocDetail] = useState(null);
  const [cType, setCType] = useState(null);

  const toNumber = useCallback((number) => {
    const toUnit = ethers.utils.formatEther(number).toString();
    const roundedCount = Math.round(parseFloat(toUnit) * 10 ** 18);
    return roundedCount;
  }, []);

  const getCType = useCallback(async () => {
    const id = toNumber(res.ctypeId);

    const ct = credentialTypes.filter((c) => c.id === id)[0];

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
  }, [toNumber, credentialTypes, organizations, setTypeDetail, setOrgDetail, setDocDetail, setCType, res]);

  const handleCreateDoc = async () => {
    const { ctypeId, to, name, propertyURI, propertyHash, _id } = res;
    createDocument({ ctypeId, to, name, propertyURI, propertyHash });
    deletePendingRequest(_id);
  };

  const deletePendingRequest = async (id) => {
    const signer = new ethers.Wallet(wallet.privateKey);
    const signature = await signer.signMessage("decentralized_identity");

    var myHeaders = new Headers();
    myHeaders.append("Authorization", signature);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      id: id,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://attestation.koompi.org/claims/delete", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    if (credentialTypes.length > 0 && organizations) {
      getCType();
    }
  }, [credentialTypes, organizations, getCType]);

  useEffect(() => {
    console.log(docDetail);
  }, [docDetail]);

  return (
    <div className=" rounded-lg p-6  border-gray-100 bg-base-100 relative overflow-hidden">
      <div className="flex flex-col place-items-start place-content-start">
        <div className="w-full flex flex-row place-content-center">
          <div className="form-control w-full">
            <label className="label pl-0">
              <span className="label-text font-bold">Owner</span>
            </label>
            <textarea
              className="w-full focus:outline-none resize-none bg-transparent font-mono text-xs"
              readOnly
              value={res.owner}
            />
          </div>

          <div className="form-control w-full">
            <label className="label pl-0">
              <span className="label-text font-bold">Created at</span>
            </label>
            <textarea
              className="w-full focus:outline-none resize-none bg-transparent font-mono text-xs"
              readOnly
              value={`${new Date(res.createdAt * 1000).toLocaleString()}`}
            />
          </div>
          <div className="form-control w-full">
            <label className="label pl-0">
              <span className="label-text font-bold">Status</span>
            </label>
            {res.status === 1 && <div className="font-bold text-xs text-success">Verified</div>}
            {res.status === 0 && <div className="font-bold text-xs text-error">Unverified</div>}
          </div>
          <div className="flex-grow flex space-x-4 place-content-center place-items-center">
            <a
              target="_blank"
              href={`/profile?user=${res.owner}&typeId=${toNumber(res.ctypeId)}`}
              rel="noopener noreferrer"
              className="p-2 flex-grow btn btn-primary btn-block"
            >
              Detail
            </a>
            {cType && cType.revokable && (
              <button
                className="p-2 flex-grow btn btn-warning"
                onClick={() => {
                  res.status === 1 && toggleRevokeDocument({ credentialid: res.id, revoke: 0 });
                  res.status === 0 && toggleRevokeDocument({ credentialid: res.id, revoke: 1 });
                }}
              >
                {res.status === 1 ? "Revoke" : "Unrevoke"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
