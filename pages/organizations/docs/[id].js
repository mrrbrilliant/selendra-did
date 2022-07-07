import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { DataContext } from "../../../contexts/data";
import { ContractContext } from "../../../contexts/contract";
import { WalletContext } from "../../../contexts/wallet";
import { ethers } from "ethers";
import { VscVerified, VscUnverified } from "react-icons/vsc";
import Link from "next/link";

export default function CreateDoc() {
  const { contractRO, contractRW } = useContext(ContractContext);
  const { usersByCTypes } = useContext(DataContext);
  const [isLoading, setIsLoading] = useState(true);
  const [allDocsByCtype, setAllDocsByCtype] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (contractRO) {
      if (isLoading) {
        usersByCTypes(id).then((docs) => {
          setAllDocsByCtype(docs);
          setIsLoading(false);
        });
      }
    }
  }, [isLoading, setIsLoading, setAllDocsByCtype, usersByCTypes, id, contractRO]);

  return (
    <div className="grid grid-cols-3 gap-6">
      {allDocsByCtype.map((res, index) => (
        <DocumentCard key={index} res={res} />
      ))}
    </div>
  );
}

const DocumentCard = ({ res }) => {
  const { organizations, isOrgLoading, credentialTypes, createDocument, toggleRevokeDocument } =
    React.useContext(DataContext);
  const { wallet } = useContext(WalletContext);

  const [typeDetail, setTypeDetail] = useState();
  const [orgDetail, setOrgDetail] = useState();
  const [docDetail, setDocDetail] = useState();
  const [cType, setCType] = useState();

  function toNumber(number) {
    const toUnit = ethers.utils.formatEther(number).toString();
    const roundedCount = Math.round(parseFloat(toUnit) * 10 ** 18);
    return roundedCount;
  }

  async function getCType() {
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
  }

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
    getCType();
  }, []);

  useEffect(() => {
    console.log(res);
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
          <textarea className="w-full mt-2 focus:outline-none resize-none" readOnly>
            {res.propertyHash}
          </textarea>

          <div className="flex space-x-4">
            {/* <Link href={`${res.propertyURI}`}> */}
            <a
              target="_blank"
              href={`${res.propertyURI}`}
              rel="noopener noreferrer"
              className="p-2 flex-grow text-white leading-none rounded font-bold mt-2 btn btn-info btn-sm hover:bg-opacity-75 text-xs uppercase"
            >
              Detail
            </a>
            {/* </Link> */}
            {cType && cType.revokable && (
              <button
                className="p-2 text-white w-32 leading-none rounded font-bold mt-2 bg-primarypink hover:bg-opacity-75 text-xs uppercase"
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

function Badge({ status }) {
  if (status) {
    return (
      <div className="badge badge-success gap-2 p-4 pr-8 absolute -right-4 top-4 font-bold">
        <VscVerified size={24} />
        Verified
      </div>
    );
  }

  return (
    <div className="badge badge-error gap-2 p-4 pr-8 absolute -right-4 top-4 font-bold">
      <VscUnverified size={24} />
      Unverified
    </div>
  );
}
