import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import MainLayout from "../components/mainLayout";
import { DataContext } from "../contexts/data";
import Modal from "../components/modal";
import { VscChevronDown } from "react-icons/vsc";
import { v4 as uid } from "uuid";
import { ethers } from "ethers";
// @ts-ignore
import NoData from "../assets/undraw_no_data_re_kwbl.svg";

function Claims() {
    const { isDocLoading, documents, credentialTypes, organizations } = useContext(DataContext);
    const [createOpen, setCreateOpen] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState(-1);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [createDocForm, setCreateDocForm] = useState({
        id: uid(),
        ctypeId: -1,
        to: "",
        propertiesURI: "",
        propertiesHash: "",
    });

    function toNumber(number) {
        const toUnit = ethers.utils.formatEther(number).toString();
        const roundedCount = Math.round(parseFloat(toUnit) * 10 ** 18);
        return roundedCount;
    }

    function toggleCreateOpen() {
        setCreateOpen(!createOpen);
    }

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
        </div>
    );
}

Claims.Layout = MainLayout;

export default Claims;
