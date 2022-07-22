import React, { useState, useEffect, useContext, useCallback } from "react";
import Link from "next/link";
import Modal from "../../components/modal";
import { v4 as uid } from "uuid";
import { VscChevronDown } from "react-icons/vsc";
import { DataContext } from "../../contexts/data";
import Image from "next/image";
import { ethers } from "ethers";
import { WalletContext } from "../../contexts/wallet";
import BtnWithAuth from "../../hooks/useAuthCallback";

const initialState = {
  name: "",
  type: "",
  docURL: "",
  docHash: "",
  ownerId: "",
};

const Organizations = () => {
  // Context
  const { organizations, isOrgLoading, deleteOrg, createOrg, ownOrganizations, isOwnOrgLoading } =
    useContext(DataContext);

  const { setCb, toggleRequest, wallet } = useContext(WalletContext);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createModalOpendoc, setCreateModalOpendoc] = useState(false);
  const [createModalOpenType, setCreateModalOpenType] = useState(false);

  const [extension, setExtension] = useState({
    logo: "",
    website: "",
  });
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  function toggleCreateOpenModal() {
    setCreateModalOpen(!createModalOpen);
  }

  const [createOrgForm, setCreateOrgForm] = useState({
    name: "",
    description: "",
    orgUri: "",
  });

  const [state, setState] = useState(initialState);
  const [createCtypeForm, setCreateCtypeForm] = useState({
    id: uid(),
    organizationId: -1,
    propertiesURI: "",
    propertiesHash: "",
    transferable: false,
    revokable: false,
    expirable: false,
    lifespan: 0,
  });

  function handleExtensionChange(e) {
    const { name, value } = e.target;
    if (name === "website") {
      setExtension({ ...extension, [name]: value });
      return;
    }

    if (name === "logo") {
      const { files } = e.target;

      if (files.length === 0) return;

      setIsUploadingImages(true);

      let formData = new FormData();
      formData.append("logo", files[0], files[0].name);

      var requestOptions = {
        method: "POST",
        body: formData,
      };

      return fetch("https://gateway.kumandra.org/api/add", requestOptions)
        .then((response) => response.text())
        .then((response) => {
          const data = response.split("\n");

          let urls = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i] !== "") {
              let _d = JSON.parse(data[i]);
              urls.push(`https://gateway.kumandra.org/files/${_d.Hash}`);
            }
          }
          setExtension({ ...extension, [name]: urls[0] });
        })
        .catch((error) => null);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCreateOrgForm({ ...createOrgForm, [name]: value });
  };

  const handleCreateOrg = (e) => {
    e.preventDefault();

    toggleCreateOpenModal();
    createOrg({ ...createOrgForm });
  };

  const otherOrgs = () => {
    return organizations.filter(function (array_el) {
      return (
        ownOrganizations.filter(function (anotherOne_el) {
          return anotherOne_el.name == array_el.name;
        }).length == 0
      );
    });
  };

  useEffect(() => {
    setCreateOrgForm({ ...createOrgForm, orgUri: JSON.stringify(extension) });
  }, [extension, setCreateOrgForm]);

  return (
    <div>
      {/* =================>create orgaization Modal<================== */}
      <Modal open={createModalOpen} toggle={toggleCreateOpenModal}>
        <form className="form-control w-full" onSubmit={handleCreateOrg}>
          {extension.logo && (
            <div className="w-full absolute -top-20 left-0 flex place-items-center place-content-center">
              <div className="avatar">
                <div className="w-28 rounded-full ring-4 ring-primary ring-offset-base-100 ring-offset-4">
                  <img src={extension.logo} alt="" />
                </div>
              </div>
            </div>
          )}
          {/* name */}

          <label className="label">
            <span className="label-text text-lg">What is your organization name?</span>
          </label>
          <input
            type="text"
            placeholder="Selendra"
            className=" w-full p-2 rounded input input-bordered autofill:bg-transparent"
            name="name"
            value={createOrgForm.name}
            onChange={handleChange}
          />
          {/* description */}
          <label className="label">
            <span className="label-text text-lg">Describe your orgaization.</span>
          </label>
          <textarea
            className="h-24 w-full p-2 rounded input input-bordered autofill:bg-transparent"
            placeholder="Interoperable Nominated Proof-of-Stake network for developing and running Substrate-based and EVM compatible blockchain applications."
            name="description"
            value={createOrgForm.description}
            onChange={handleChange}
            maxLength={512}
          />
          {/* USE orgUri as ipfs link to extend organization information */}
          {/* Profile images */}
          <label className="label">
            <span className="label-text text-lg">Your organization website</span>
          </label>
          <input
            type="text"
            placeholder="https://selendra.org"
            className=" w-full p-2 rounded input input-bordered autofill:bg-transparent"
            name="website"
            onChange={handleExtensionChange}
          />
          <label className="label">
            <span className="label-text text-lg">Your organization logo</span>
          </label>
          <input
            type="file"
            placeholder="https://selendra.org"
            className="input input-bordered w-full flex place-content-center h-full p-2 rounded autofill:bg-transparent"
            name="logo"
            onChange={handleExtensionChange}
          />
          {/* Org website */}
          <input type="submit" className="btn btn-primary mt-4" value="Create" />
        </form>
      </Modal>

      {/* ===================owner Organization======================= */}
      <div className="flex flex-col gap-6">
        <div className="flex place-content-center place-items-center">
          <h3 className="font-bold flex-grow">My Organizations</h3>
          <div className="flex justify-end  rounded-xl space-x-4">
            <BtnWithAuth callback={toggleCreateOpenModal} className="">
              <label className="btn btn-primary rounded-xl modal-button">Create Organizations</label>
            </BtnWithAuth>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-7">
          {ownOrganizations &&
            ownOrganizations.map((org, index) => {
              return (
                <div key={index} className="w-auto bg-base-100 p-4 rounded-xl transform transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <Image
                      className="flex-none w-14 h-14 rounded-full object-cover"
                      src={JSON.parse(org.uri)["logo"] || `https://avatars.dicebear.com/api/male/${org.name}.svg`}
                      width={96}
                      height={96}
                      alt=""
                    />

                    <p className="font-bold">{org.name}</p>
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
                    <h1>Asset types :</h1>
                    <p className="font-bold">80</p>
                  </div>

                  <div className="flex items-center space-x-4 mb-2">
                    <h1>Assets created :</h1>
                    <p className="font-bold">80</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <h1>Holders :</h1>
                    <p className="font-bold">80</p>
                  </div>

                  <div className="mt-4 cursor-pointer">
                    <Link href={`/organizations/${org.id}`} as={`/organizations/${org.id}`}>
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

      {/* =========================>other orgaization======================= */}

      <div className="py-6">
        <h3 className="font-bold">Other Organizations</h3>
      </div>
      <div className="grid grid-cols-4 gap-7 mt-4">
        {organizations &&
          ownOrganizations &&
          otherOrgs().map((org, index) => {
            return (
              <div key={index} className="w-auto bg-base-100 p-4 rounded-xl transform transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <Image
                    className="flex-none w-14 h-14 rounded-full object-cover"
                    src="https://avatars.githubusercontent.com/u/49308834?s=200&v=4"
                    width={56}
                    height={56}
                    alt=""
                  />
                  <p className="font-bold">{org.name}</p>
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
                  <Link href={`/organizations/${org.id}`} as={`/organizations/${org.id}`}>
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
  );
};

export default Organizations;
