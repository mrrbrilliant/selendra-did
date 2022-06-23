import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import MainLayout from "../components/mainLayout";
import { DataContext } from "../contexts/data";
import Modal from "../components/modal";
// <<<<<<< HEAD
// import { VscChevronDown } from "react-icons/vsc";
// import { v4 as uid } from "uuid";
// import { ethers } from "ethers";
// // @ts-ignore
// =======
import Link from "next/link";

// >>>>>>> origin/den
import NoData from "../assets/undraw_no_data_re_kwbl.svg";

const initialState = {
    name: "",
    type: "",
    docURL: "",
    docHash: "",
    ownerId: "",
};
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

function Claims() {
    // <<<<<<< HEAD
    //     const { isDocLoading, documents, credentialTypes, organizations } = useContext(DataContext);
    //     const [createOpen, setCreateOpen] = useState(false);
    //     const [selectedOrg, setSelectedOrg] = useState(-1);
    //     const [createModalOpen, setCreateModalOpen] = useState(false);
    //     const [createDocForm, setCreateDocForm] = useState({
    //         id: uid(),
    //         ctypeId: -1,
    //         to: "",
    //         propertiesURI: "",
    //         propertiesHash: "",
    //     });

    //     function toNumber(number) {
    //         const toUnit = ethers.utils.formatEther(number).toString();
    //         const roundedCount = Math.round(parseFloat(toUnit) * 10 ** 18);
    //         return roundedCount;
    //     }
    // =======
    const { isDocLoading, documents } = useContext(DataContext);
    const [createOpen, setCreateOpen] = useState(false);
    // >>>>>>> origin/den

    function toggleCreateOpen() {
        setCreateOpen(!createOpen);
    }
    const [state, setState] = useState(initialState);

    function handleChange(e) {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
        console.log(e.target.value);
    }
    return <div className="-mt-10">{isDocLoading && <progress className="progress w-56"></progress>}</div>;

    // <<<<<<< HEAD
    function handleCreateDocs() {}

    function handleChange(e) {
        const { name, value } = e.target;
        setCreateDocForm({ ...createDocForm, [name]: value });
    }

    return (
        <div className="overflow-x-auto w-full mt-4">
            {isDocLoading && <progress className="progress w-56" />}

            {!isDocLoading && documents?.length === 0 && (
                <div className="w-full h-[50vh] flex flex-col place-content-center place-items-center gap-6">
                    <Image src={NoData} alt="" width="176px" />
                    <h1 className="text-lg">No data recorded yet</h1>
                    <button className="btn btn-primary text-primary-content" onClick={toggleCreateOpen}>
                        Insert
                    </button>
                </div>
            )}

            {/* uint256 ctypeId,
            address to,
            string memory name,
            string memory propertyURI,
            string memory propertyHash */}
            <Modal open={createOpen} toggle={toggleCreateOpen}>
                <form className="form-control w-full" onSubmit={handleCreateDocs}>
                    <label className="label">
                        <span className="label-text">Organization</span>
                    </label>

                    <div className="dropdown w-full">
                        <label tabIndex={0} className="input-group input m-0 p-0">
                            <input
                                name="organizationId"
                                type="text"
                                placeholder="Selendra"
                                className="input w-full flex-grow outline-none focus:outline-none"
                                value={
                                    selectedOrg !== -1 ? organizations.filter((o) => o.id == selectedOrg)[0].name : ""
                                }
                                readOnly={true}
                            />
                            <span className="bg-transparent">
                                <VscChevronDown />
                            </span>
                        </label>
                        <div className="w-full dropdown-content menu p-0 shadow-lg bg-base-100 rounded-lg my-2 overflow-hidden outline outline-base-300">
                            {organizations &&
                                organizations.length > 0 &&
                                organizations.map((o, index) => (
                                    <label
                                        htmlFor="organizationId"
                                        tabIndex={index}
                                        key={o.id}
                                        className="label cursor-pointer hover:bg-blue-300 p-2 transition-all"
                                        onClick={(e) => setSelectedOrg(toNumber(o.id))}
                                    >
                                        {o.name}
                                    </label>
                                ))}
                        </div>
                    </div>

                    <label className="label">
                        <span className="label-text">Type</span>
                    </label>

                    <div className="dropdown w-full">
                        <label tabIndex={0} className="input-group input m-0 p-0">
                            <input
                                name="organizationId"
                                type="text"
                                placeholder="National identity"
                                className="input w-full flex-grow outline-none focus:outline-none"
                                value={createDocForm.ctypeId !== -1 ? createDocForm.ctypeId : ""}
                                readOnly={true}
                            />
                            <span className="bg-transparent">
                                <VscChevronDown />
                            </span>
                        </label>
                        <div className="w-full dropdown-content menu p-0 shadow-lg bg-base-100 rounded-lg my-2 overflow-hidden outline outline-base-300">
                            {credentialTypes &&
                                credentialTypes.length > 0 &&
                                credentialTypes
                                    .filter((o) => toNumber(o.orgId) === selectedOrg)
                                    .map((o) => (
                                        <label
                                            tabIndex={0}
                                            key={o.id}
                                            className="label cursor-pointer hover:bg-blue-300 p-2 transition-all overflow-hidden text-ellipsis"
                                            onClick={() => setCreateDocForm({ ...createDocForm, ctypeId: o.id })}
                                        >
                                            {o.propertiesHash}
                                        </label>
                                    ))}
                        </div>
                    </div>

                    <label className="label">
                        <span className="label-text">Document URL</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Type here"
                        className="input input-bordered w-full"
                        name="propertiesURI"
                        // value={createDocForm.propertiesURI}
                        // onChange={handleChange}
                    />
                    <label className="label">
                        <span className="label-text">Document hash</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Type here"
                        className="input input-bordered w-full"
                        name="propertiesHash"
                        // value={createDocForm.propertiesHash}
                        // readOnly={true}
                    />

                    <label className="label">
                        <span className="label-text">Owner ID</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Type here"
                        className="input input-bordered w-full"
                        name="propertiesURI"
                        // value={createDocForm.propertiesURI}
                        // onChange={handleChange}
                    />

                    <input type="submit" className="btn mt-4" value="Create" />
                </form>
            </Modal>
            {/* ======= */}
            {!isDocLoading && documents?.length === 0 && (
                <div className="w-full h-[50vh] flex flex-col place-content-center place-items-center gap-6">
                    <Image src={NoData} alt="" width="176px" />
                    <h1 className="text-lg">No data recorded yet</h1>
                    <button className="btn btn-primary text-primary-content" onClick={toggleCreateOpen}>
                        Insert
                    </button>
                    {/* >>>>>>> origin/den */}
                </div>
            )}
            <div>
                <div className="flex justify-end rounded-xl mt-6">
                    <label
                        onClick={toggleCreateOpen}
                        className="btn bg-accent rounded-xl modal-button"
                        htmlFor="my-modal-3"
                    >
                        Create Credentails
                    </label>
                </div>

                <div className="grid grid-cols-2 mt-3 gap-7">
                    {data.map((res) => {
                        return (
                            // eslint-disable-next-line react/jsx-key
                            <div className=" rounded-lg p-3  border-gray-100 bg-white">
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
            <Modal open={createOpen} toggle={toggleCreateOpen}>
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
                        onChange={handleChange}
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
                        onChange={handleChange}
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
                        onChange={handleChange}
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
                        onChange={handleChange}
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
                        onChange={handleChange}
                    />
                    <input type="submit" className="btn mt-4" value="Create" />
                </form>
            </Modal>
        </div>
    );
}

export default Claims;
