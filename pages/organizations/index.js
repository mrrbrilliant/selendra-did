import React, { useState, useEffect, useContext } from "react";
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

  function toggleCreateOpenModal() {
    setCreateModalOpen(!createModalOpen);
  }
  function toggleCreateOpenModaldoc() {
    setCreateModalOpendoc(!createModalOpendoc);
  }

  function toggleCreateOpenModalType() {
    setCreateModalOpenType(!createModalOpenType);
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
  function handleChange(e) {
    const { name, value } = e.target;
    setCreateOrgForm({ ...createOrgForm, [name]: value });
    console.log(e.target.value);
  }

  function handleChangeDoc(e) {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
    console.log(e.target.value);
  }
  function handleChangeType(e) {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setCreateCtypeForm({ ...createCtypeForm, [name]: checked });
      return;
    }
    setCreateCtypeForm({ ...createCtypeForm, [name]: value });
    console.log(value);
  }

  function handleCreateOrg(e) {
    e.preventDefault();
    toggleCreateOpenModal();
    createOrg({ ...createOrgForm });
  }

  function toNumber(number) {
    const toUnit = ethers.utils.formatEther(number).toString();
    const roundedCount = Math.round(parseFloat(toUnit) * 10 ** 18);
    return roundedCount;
  }

  useEffect(() => {
    console.log(JSON.stringify(createOrgForm, null, 4));
  }, [createOrgForm]);

  const otherOrgs = organizations.filter(function (array_el) {
    return (
      ownOrganizations.filter(function (anotherOne_el) {
        return anotherOne_el.name == array_el.name;
      }).length == 0
    );
  });

  useEffect(() => {
    console.log(organizations);
  }, [organizations]);

  return (
    <>
      {/* =================>create orgaization Modal<================== */}
      <Modal open={createModalOpen} toggle={toggleCreateOpenModal}>
        <form className="form-control w-full" onSubmit={handleCreateOrg}>
          {/* name */}
          <label className="label">
            <span className="label-text text-lg">What is your organization name?</span>
          </label>
          <input
            type="text"
            placeholder="Selendra"
            className="bg-gray-200 w-full p-2 rounded text-black"
            name="name"
            // value={createOrgForm.name}
            onChange={handleChange}
          />
          {/* description */}
          <label className="label">
            <span className="label-text text-lg">Describe your orgaization.</span>
          </label>
          <textarea
            className="  h-24 bg-gray-200 w-full p-2 rounded text-black"
            placeholder="Interoperable Nominated Proof-of-Stake network for developing and running Substrate-based and EVM compatible blockchain applications."
            defaultValue={""}
            name="description"
            // value={createOrgForm.description}
            onChange={handleChange}
            maxLength={168}
          />
          {/* orgUri */}
          <label className="label">
            <span className="label-text text-lg">Link to your organization</span>
          </label>
          <input
            type="text"
            placeholder="https://selendra.org"
            className="bg-gray-200 w-full p-2 rounded text-black"
            name="orgUri"
            // value={createOrgForm.orgUri}
            onChange={handleChange}
          />
          <input type="submit" className="btn mt-4" value="Create" />
        </form>
      </Modal>

      {/* =====================>Modal create doc<<================= */}

      <Modal open={createModalOpendoc} toggle={toggleCreateOpenModaldoc}>
        <form
          className="form-control w-full"
          //   onSubmit={handleCreateOrg}
        >
          <label className="label">
            <span className="label-text text-lg">Organization</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="bg-gray-200 w-full p-2 rounded text-black"
            name="name"
            // value={createOrgForm.name}
            onChange={handleChangeDoc}
          />
          <label className="label mt-3">
            <span className="label-text text-lg">Type</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="bg-gray-200 w-full p-2 rounded text-black"
            name="type"
            // value={createOrgForm.name}
            onChange={handleChangeDoc}
          />
          <label className="label mt-3">
            <span className="label-text text-lg">Document URL</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="bg-gray-200 w-full p-2 rounded text-black"
            name="docURL"
            // value={createOrgForm.name}
            onChange={handleChangeDoc}
          />
          <label className="label mt-3">
            <span className="label-text text-lg">Document Hash</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="bg-gray-200 w-full p-2 rounded text-black"
            name="docHash"
            // value={createOrgForm.name}
            onChange={handleChangeDoc}
          />
          <label className="label mt-3">
            <span className="label-text text-lg">OwnerId</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="bg-gray-200 w-full p-2 rounded text-black"
            name="ownerId"
            // value={createOrgForm.name}
            onChange={handleChangeDoc}
          />
          <input type="submit" className="btn mt-4" value="Create" />
        </form>
      </Modal>

      {/* //====================>Modal Doctype<<==================== */}
      <Modal open={createModalOpenType} toggle={toggleCreateOpenModalType}>
        <form
          className="form-control w-full"
          //   onSubmit={handleCreateCtype}
        >
          <label className="label">
            <span className="label-text text-lg">Organization</span>
          </label>
          <div className="dropdown w-full mb-4">
            <label tabIndex={0} className="input-group input m-0 p-0">
              <input
                name="organizationId"
                type="text"
                placeholder="Type"
                className=" bg-gray-200 w-full p-2 rounded text-black"
                readOnly={true}
              />
              <span className="bg-transparent">
                <VscChevronDown />
              </span>
            </label>
          </div>
          <label className="label">
            <span className="label-text text-lg">Schema URL</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="bg-gray-200 w-full p-2 rounded text-black mb-4"
            name="propertiesURI"
            // value={createCtypeForm.propertiesURI}
            onChange={handleChangeType}
          />
          <label className="label ">
            <span className="label text-lg">Schema hash</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="bg-gray-200 w-full p-2 rounded text-black mb-4"
            name="propertiesHash"
            onChange={handleChangeType}
            // value={createCtypeForm.propertiesHash}
            readOnly={true}
          />
          <div>
            <label className="cursor-pointer label">
              <span className="label-text text-base">Expirable</span>
              <input
                type="checkbox"
                className="checkbox checkbox-accent"
                name="expirable"
                // checked={createCtypeForm.expirable}
                onChange={handleChangeType}
              />
            </label>
          </div>

          <div>
            <label className="cursor-pointer label">
              <span className="label-text text-base">Transferable</span>
              <input
                type="checkbox"
                className="checkbox checkbox-accent"
                name="transferable"
                // checked={createCtypeForm.transferable}
                onChange={handleChangeType}
              />
            </label>
            <label className="cursor-pointer label">
              <span className="label-text text-base">Revokable</span>
              <input
                type="checkbox"
                className="checkbox checkbox-accent"
                name="revokable"
                // checked={createCtypeForm.revokable}
                onChange={handleChangeType}
              />
            </label>
          </div>
          <input type="submit" className="btn mt-4" value="Create" />
        </form>
      </Modal>

      <div className="flex justify-end -mt-9 rounded-xl space-x-4">
        {/* <label
          onClick={() => {
            toggleCreateOpenModal();
          }}
          className="btn bg-accent rounded-xl modal-button"
        >
          Unlock CB
        </label> */}
        {/* <label
          onClick={(e) => {
            if (wallet) {
              toggleCreateOpenModal();
            } else {
              const cb = () => toggleCreateOpenModal();
              setCb(() => cb);
              toggleRequest();
            }
          }}
          className="btn bg-accent rounded-xl modal-button"
          htmlFor="my-modal-3"
        >
          Create Organizations
        </label> */}

        <BtnWithAuth callback={toggleCreateOpenModal}>
          <label className="btn bg-accent rounded-xl modal-button">Create Organizations</label>
        </BtnWithAuth>

        {/* <label
          onClick={toggleCreateOpenModaldoc}
          className="btn bg-accent rounded-xl modal-button ml-2"
          htmlFor="my-modal-3"
        >
          Create Documents
        </label>
        <label
          onClick={toggleCreateOpenModalType}
          className="btn bg-accent rounded-xl modal-button ml-2"
          htmlFor="my-modal-3"
        >
          Create Documents Type
        </label> */}
      </div>
      {/* ===================owner Organization======================= */}
      <div className="mb-8">
        <div>
          <h3 className="font-bold">My Organizations</h3>
        </div>
        <div className="grid grid-cols-4 gap-7 mt-4">
          {ownOrganizations &&
            ownOrganizations.map((org, index) => {
              return (
                <div key={index} className="w-auto bg-white p-4 rounded-xl transform transition-all duration-300">
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
      <div>
        <h3 className="font-bold">Other Organizations</h3>
      </div>
      <div className="grid grid-cols-4 gap-7 mt-4">
        {organizations &&
          ownOrganizations &&
          otherOrgs.map((org, index) => {
            return (
              <div key={index} className="w-auto bg-white p-4 rounded-xl transform transition-all duration-300">
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
    </>
  );
};

export default Organizations;
