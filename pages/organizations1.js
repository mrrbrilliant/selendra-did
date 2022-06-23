import React, { useState, useEffect } from "react";
import Link from "next/link";
import Modal from "../components/modal";

const Organizations1 = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  function toggleCreateOpenModal() {
    setCreateModalOpen(!createModalOpen);
  }
  const [createOrgForm, setCreateOrgForm] = useState({
    name: "",
    description: "",
    orgUri: "",
  });
  function handleChange(e) {
    const { name, value } = e.target;
    setCreateOrgForm({ ...createOrgForm, [name]: value });
    console.log(e.target.value);
  }
  useEffect(() => {
    console.clear();
    console.log(JSON.stringify(createOrgForm, null, 4));
  }, [createOrgForm]);
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
      {/* <input type="checkbox" id="my-modal-3" class="modal-toggle" />
      <div class="modal">
        <div class="modal-box relative">
          <label
            for="my-modal-3"
            class="btn btn-sm btn-circle  absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 class="text-lg font-bold">
            Congratulations random Interner user!
          </h3>
          <p class="py-4">
            You've been selected for a chance to get one year of subscription to
            use Wikipedia for free!
          </p>
        </div>
      </div> */}
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
      <div className="flex justify-end -mt-9 rounded-xl">
        <label
          onClick={toggleCreateOpenModal}
          className="btn bg-accent rounded-xl modal-button"
          for="my-modal-3"
        >
          Create Organizations
        </label>
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
