import React, { useState } from "react";
import Link from "next/link";
import Modal from "../../components/modal";
import { v4 as uid } from "uuid";
import { VscChevronDown } from "react-icons/vsc";
const Index1 = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  function toggleCreateOpenModal() {
    setCreateModalOpen(!createModalOpen);
  }
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
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setCreateCtypeForm({ ...createCtypeForm, [name]: checked });
      return;
    }
    setCreateCtypeForm({ ...createCtypeForm, [name]: value });
  }
  const data = [
    {
      name: "Certificate grade 9",
      des: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      link: "www.Moeyscambodia",
      logo: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/best-attendance-certificate-design-template-03eed0c5e01d99fe53f9db966464ea5a_screen.jpg?ts=1561443060",
    },
    {
      name: "Certificate grade 12",
      des: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      link: "www.Moeyscambodia",
      logo: "https://images.sampletemplates.com/wp-content/uploads/2016/03/24064236/sample-certificate-of-appreciation-editable.jpg",
    },
    {
      name: "Doctorate certificate",
      des: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      link: "www.Moeyscambodia",
      logo: "https://i.pinimg.com/originals/55/a9/d8/55a9d8819866579ec7429023cb6735cf.jpg",
    },
    {
      name: "PhD in Neuroscience Certificate",
      des: "When a person creates an original work, fixed in a tangible medium, he or she automatically owns copyright to the work.",
      link: "www.Moeyscambodia",
      logo: "https://www.kuleuven.be/brain-institute/afbeeldingen/phd-neuroscience-certificate.png/image",
    },
  ];
  return (
    <div>
      <div className="flex justify-end -mt-9 rounded-xl">
        <label onClick={toggleCreateOpenModal} className="btn bg-accent rounded-xl modal-button" for="my-modal-3">
          Create Credentails
        </label>
      </div>
      <Modal open={createModalOpen} toggle={toggleCreateOpenModal}>
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
            onChange={handleChange}
          />
          <label className="label ">
            <span className="label text-lg">Schema hash</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="bg-gray-200 w-full p-2 rounded text-black mb-4"
            name="propertiesHash"
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
                onChange={handleChange}
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
                onChange={handleChange}
              />
            </label>
            <label className="cursor-pointer label">
              <span className="label-text text-base">Revokable</span>
              <input
                type="checkbox"
                className="checkbox checkbox-accent"
                name="revokable"
                // checked={createCtypeForm.revokable}
                onChange={handleChange}
              />
            </label>
          </div>
          <input type="submit" className="btn mt-4" value="Create" />
        </form>
      </Modal>
      <div className="grid grid-cols-2 mt-3 gap-7">
        {data.map((res) => {
          return (
            <div className=" rounded-lg p-3  border-gray-100 bg-base-100">
              <div className="grid md:grid-cols-5 gap-10">
                <div className="md:col-span-2">
                  {/* <div
                    className="bg-no-repeat bg-center h-40 w-auto rounded"
                    // className="h-72 mx-auto object-cover w-max"
                    style={{
                      backgroundImage: `url(${res.logo})`,
                    }}
                  ></div> */}
                  <div>
                    <img className="h-40 mx-auto object-cover w-max" src={res.logo} />
                  </div>
                </div>
                <div className="md:col-span-3">
                  <h4 className="text-xl font-semibold">{res.name}</h4>
                  <p className="text-lg mt-2">{res.des.substring(0, 100)}...</p>
                  <Link href="/ctypes/create1">
                    <button className="p-2 text-white w-32 leading-none rounded font-bold mt-2 bg-primarypink hover:bg-opacity-75 text-xs uppercase">
                      Create
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Index1;
