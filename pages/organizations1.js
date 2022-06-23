import React, { useState, useEffect } from "react";
import Link from "next/link";
import Modal from "../components/modal";
import { v4 as uid } from "uuid";
import { VscChevronDown } from "react-icons/vsc";
const initialState = {
  name: "",
  type: "",
  docURL: "",
  docHash: "",
  ownerId: "",
};

const Organizations1 = () => {
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
  useEffect(() => {
    console.clear();
    console.log(JSON.stringify(createOrgForm, null, 4));
  }, [createOrgForm]);

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

  const data = [
    {
      name: "Moeys Cambodia",
      des: "hello world",
      link: "www.Moeyscambodia",
      logo: "/images/moeyslogo.png",
    },
    {
      name: "Ministry of Tourism",
      des: "hello world",
      link: "www.Moeyscambodia",
      logo: "https://atf2022cambodia.com/images/mot-logo.png",
    },
    {
      name: "Ministry of Health",
      des: "hello world",
      link: "www.Moeyscambodia",
      logo: "https://upload.wikimedia.org/wikipedia/en/3/30/MOH_logo.png",
    },
    {
      name: "Ministry Of National Defence Of Cambodia",
      des: "hello world",
      link: "www.Moeyscambodia",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Ministry_of_National_Defense_%28Cambodia%29.png/440px-Ministry_of_National_Defense_%28Cambodia%29.png",
    },
    {
      name: "Ministries and Institutions",
      des: "hello world",
      link: "www.Moeyscambodia",
      logo: "https://www.mfaic.gov.kh/ministriesLogo/uploads/JNURR9M0JW9X/Press%20OMC.png",
    },
    {
      name: "MAFF (Cambodia)",
      des: "hello world",
      link: "www.Moeyscambodia",
      logo: "https://i.pinimg.com/originals/00/f0/bc/00f0bc241249b9688da89e15a53ee795.png",
    },
    {
      name: "WAT4CAM",
      des: "hello world",
      link: "www.Moeyscambodia",
      logo: "https://wat4cam-mowram.com/images/logo.png",
    },
    {
      name: "Ministries and Institutions",
      des: "hello world",
      link: "www.Moeyscambodia",
      logo: "https://www.mfaic.gov.kh/ministriesLogo/uploads/I1MQHWGFJFNF/Ministry%20of%20Mines%20and%20Energy.png",
    },
  ];

  return (
    <>
      {/* =================>create orgaization Modal<================== */}
      <Modal open={createModalOpen} toggle={toggleCreateOpenModal}>
        <form
          className="form-control w-full"
          //   onSubmit={handleCreateOrg}
        >
          {/* name */}
          <label className="label">
            <span className="label-text text-lg">
              What is your organization name?
            </span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="bg-gray-200 w-full p-2 rounded text-black"
            name="name"
            // value={createOrgForm.name}
            onChange={handleChange}
          />
          {/* description */}
          <label className="label">
            <span className="label-text text-lg">
              Describe your orgaization.
            </span>
          </label>
          <textarea
            className="  h-24 bg-gray-200 w-full p-2 rounded text-black"
            placeholder="Bio"
            defaultValue={""}
            name="description"
            // value={createOrgForm.description}
            onChange={handleChange}
            maxLength={168}
          />
          {/* orgUri */}
          <label className="label">
            <span className="label-text text-lg">
              Link to your organization
            </span>
          </label>
          <input
            type="text"
            placeholder="Type here"
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
                // value={
                //     createCtypeForm.organizationId !== -1
                //         ? organizations.filter((o) => o.id == createCtypeForm.organizationId)[0].name
                //         : ""
                // }
                // value="test"
                readOnly={true}
              />
              <span className="bg-transparent">
                <VscChevronDown />
              </span>
            </label>
            {/* <div
                            tabIndex={0}
                            className="w-full dropdown-content menu p-0 shadow-lg bg-base-100 rounded-box mb-2"
                        >
                            {organizations &&
                                organizations.length > 0 &&
                                organizations.map((o) => (
                                    <label
                                        key={o.id}
                                        className="label cursor-pointer hover:bg-blue-300 p-2 transition-all"
                                    >
                                        <span className="label-text">{o.name}</span>
                                        <input
                                            type="radio"
                                            name="organizationId"
                                            className="radio checked:bg-blue-500"
                                            checked={createCtypeForm.organizationId == o.id}
                                            value={o.id}
                                            onChange={(e) =>
                                                setCreateCtypeForm({
                                                    ...createCtypeForm,
                                                    organizationId: toNumber(o.id),
                                                })
                                            }
                                        />
                                    </label>
                                ))}
                        </div> */}
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
                defaultChecked={false}
                className="checkbox checkbox-accent"
                name="expirable"
                // checked={createCtypeForm.expirable}
                onChange={handleChangeType}
              />
            </label>
            {/* {createCtypeForm.expirable && (
              <input
                type="number"
                placeholder="Number of days to expire"
                className="input input-bordered w-full"
                name="lifespan"
                // value={createCtypeForm.lifespan}
                onChange={handleChange}
              />
            )} */}
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
                defaultChecked={false}
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

      <div className="flex justify-end -mt-9 rounded-xl">
        <label
          onClick={toggleCreateOpenModal}
          className="btn bg-accent rounded-xl modal-button"
          for="my-modal-3"
        >
          Create Organizations
        </label>
        <label
          onClick={toggleCreateOpenModaldoc}
          className="btn bg-accent rounded-xl modal-button ml-2"
          for="my-modal-3"
        >
          Create Documents
        </label>
        <label
          onClick={toggleCreateOpenModalType}
          className="btn bg-accent rounded-xl modal-button ml-2"
          for="my-modal-3"
        >
          Create Documents Type
        </label>
      </div>
      {/* ===================owner Organization======================= */}
      <div className="mb-8">
        <div>
          <h3 className="font-bold">My Organizations</h3>
        </div>
        <div className="grid grid-cols-4 gap-7 mt-4">
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

      {/* =========================>other orgaization======================= */}
      <div>
        <h3 className="font-bold">Other Organizations</h3>
      </div>
      <div className="grid grid-cols-4 gap-7 mt-4">
        {data.map((res) => {
          return (
            <div className="w-auto bg-white p-4 rounded-xl transform transition-all duration-300">
              <div className="flex items-center space-x-4">
                <img
                  className="flex-none w-14 h-14 rounded-full object-cover"
                  src={res.logo}
                />
                <p className="font-bold">{res.name}</p>
              </div>
              {/* <div className="mt-3">
                <p className="text-md text-gray-600">
                  {res.des.substring(0, 190)}...
                </p>
              </div> */}
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
    </>
  );
};

export default Organizations1;
