import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { DataContext } from "../../contexts/data";
import { ethers } from "ethers";
import Link from "next/link";
import Image from "next/image";
import Modal from "../../components/modal";
import { VscChevronDown } from "react-icons/vsc";
import { WalletContext } from "../../contexts/wallet";
import { VscVerified, VscUnverified } from "react-icons/vsc";
import BtnWithAuth from "../../hooks/useAuthCallback";

export default function Org() {
  const { organizations, isOrgLoading, credentialTypes, isCTLoading, ownOrganizations, isOwnOrgLoading, deleteOrg } =
    React.useContext(DataContext);
  const { wallet, checkingAuth } = React.useContext(WalletContext);
  const [isCheckingUnverifiedDocs, setIsCheckUnverifiedDocs] = useState(true);

  const [unVerifiedDocs, setUnverifiedDocs] = useState([]);
  const [isChecking, setIsChecking] = React.useState(true);
  const [org, setOrg] = useState();
  const [isOwnOrg, setIsOwnOrg] = useState(false);
  const [removeModalOpen, setRemoveModelOpen] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  function toNumber(number) {
    if (!number) number = 0;
    try {
      const toUnit = ethers.utils.formatEther(number).toString();
      const roundedCount = Math.round(parseFloat(toUnit) * 10 ** 18);
      return roundedCount;
    } catch (e) {
      console.log("error", e, number);
      return number;
    }
  }

  function toggleRemoveModel() {
    setRemoveModelOpen(!removeModalOpen);
  }

  const handleDeleteOrg = () => {
    deleteOrg(id).then(() => {
      toggleRemoveModel();
      router.back();
    });
  };

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

    return fetch("https://attestation.koompi.org/claims/org", requestOptions)
      .then((response) => response.json())
      .then((result) => result)
      .catch((error) => error);
  };

  // get org info of current route
  useEffect(() => {
    if (!isOrgLoading && organizations && organizations.length > 0 && isChecking) {
      const _org = organizations.filter((o) => {
        console.log(o.id);
        return id == toNumber(o.id);
      });
      if (_org.length === 0) {
        // redirect if org 404
        router.push("/organizations");
      }
      setOrg(_org[0]);
      setIsChecking(false);
    }
  }, [organizations, isOrgLoading, isChecking, setIsChecking, setOrg, id, router]);

  // check if current org in own org
  useEffect(() => {
    if (ownOrganizations && org) {
      const result = ownOrganizations.filter((o) => o.name === org.name);
      if (result.length === 0) {
        setIsOwnOrg(false);
        return;
      }
      setIsOwnOrg(true);
    }
  }, [org, ownOrganizations]);

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
    <>
      <Modal open={removeModalOpen} toggle={toggleRemoveModel}>
        <h3 className="font-bold text-lg">Caution!</h3>
        <p className="py-4">
          You are about to remove {org?.name || "a organization"}! This is irriversable! Are you sure
        </p>
        <div className="modal-action">
          <button className="btn btn-error" onClick={handleDeleteOrg}>
            Remove
          </button>
          <button className="btn btn-info" onClick={toggleRemoveModel}>
            Cancel
          </button>
        </div>
      </Modal>
      <div className="flex justify-between -mt-9 rounded-xl">
        <h3 className="font-bold text-xl p-2">{org?.name}</h3>
        {isOwnOrg && (
          <div>
            <BtnWithAuth callback={toggleRemoveModel}>
              <label className="btn btn-error btn-outline rounded-xl modal-button ml-2">Remove Organization</label>
            </BtnWithAuth>
            <Link href={`/organizations/types/${id}`}>
              <label className="btn bg-accent rounded-xl modal-button ml-2" htmlFor="my-modal-3">
                Create Documents Type
              </label>
            </Link>
          </div>
        )}
      </div>

      <br />
      <div className="grid grid-cols-2 mt-3 gap-7">
        {credentialTypes &&
          credentialTypes
            .filter((o) => toNumber(o.orgId) === parseInt(id))
            .map((type, index) => {
              return <TypeCard key={index} type={type} isOwnOrg={isOwnOrg} />;
            })}
      </div>
      {isOwnOrg && unVerifiedDocs.length > 0 && (
        <div className="my-10">
          <h3 className="font-bold text-xl p-2">Attestation Requests</h3>
          <div className="grid grid-cols-3 mt-6 gap-6 ">
            {unVerifiedDocs &&
              unVerifiedDocs.map((res, index) => {
                return <DocumentCard key={index} res={res} />;
              })}
          </div>
        </div>
      )}
      <br />
    </>
  );
}

const TypeCard = ({ type, isOwnOrg }) => {
  const [detail, setDetail] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const { propertiesURI } = type;

  function toNumber(number) {
    const toUnit = ethers.utils.formatEther(number).toString();
    const roundedCount = Math.round(parseFloat(toUnit) * 10 ** 18);
    return roundedCount;
  }

  useEffect(() => {
    if (isLoading) {
      fetch(propertiesURI)
        .then((res) => res.text())
        .then((data) => {
          setDetail(JSON.parse(data));
          setIsLoading(false);
        })
        .catch((error) => console.log(error));
    }
  }, [isLoading, setDetail, propertiesURI]);

  if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    <div className=" rounded-lg p-3  border-gray-100 bg-white">
      <div className="flex space-x-4 p-4">
        <div className="w-40 h-40 text-center">
          <Image
            className="w-40 h-40 mx-auto object-contain"
            src={
              detail?.images?.length > 0
                ? `${detail?.images[0]}`
                : "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MoEYS_%28Cambodia%29.svg/1200px-MoEYS_%28Cambodia%29.svg.png"
            }
            alt=""
            width={160}
            height={160}
            layout="responsive"
            objectFit="contain"
          />
        </div>
        <div className="relative">
          <h4 className="text-xl font-semibold">{detail?.title}</h4>
          <p className="text-lg mt-2">{detail?.description}</p>
          <div className="absolute bottom-0 flex gap-4">
            {isOwnOrg && (
              <Link href={`/organizations/docs?orgId=${toNumber(type.orgId)}&type=${type?.id}`}>
                <button className="btn py-2 px-4 text-white leading-none rounded font-bold  bg-primarypink hover:bg-opacity-75  uppercase">
                  Create
                </button>
              </Link>
            )}

            {!isOwnOrg && (
              <Link href={`/organizations/docs?orgId=${toNumber(type.orgId)}&type=${type?.id}`}>
                <button className="btn py-2 px-4 text-white leading-none rounded font-bold  bg-primarypink hover:bg-opacity-75  uppercase">
                  Request
                </button>
              </Link>
            )}

            <Link href={`/organizations/docs/${type?.id}`}>
              <button className="btn py-2 px-4 text-white leading-none rounded font-bold  bg-primarypink hover:bg-opacity-75  uppercase">
                Details
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const DocumentCard = ({ res }) => {
  const { organizations, isOrgLoading, credentialTypes, createDocument } = React.useContext(DataContext);
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
            <button className="p-2 flex-grow text-white leading-none rounded font-bold mt-2 btn btn-info btn-sm hover:bg-opacity-75 text-xs uppercase">
              Detail
            </button>
            <button
              className="p-2 text-white leading-none rounded font-bold mt-2 btn btn-success btn-sm hover:bg-opacity-75 text-xs uppercase"
              onClick={handleCreateDoc}
            >
              Approve
            </button>
            <button
              className="p-2 text-white leading-none rounded font-bold mt-2 btn btn-error btn-sm hover:bg-opacity-75 text-xs uppercase"
              onClick={(e) => deletePendingRequest(res._id)}
            >
              Reject
            </button>
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
      Verification pending
    </div>
  );
}
