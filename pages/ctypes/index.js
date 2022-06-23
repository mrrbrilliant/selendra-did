import Image from "next/image";
import MainLayout from "../../components/mainLayout";
import React, { useEffect, useContext, useState, useCallback } from "react";
import { ethers } from "ethers";
import lodash from "lodash";
import { v4 as uid } from "uuid";
import { VscChevronDown } from "react-icons/vsc";

import { DataContext } from "../../contexts/data";
// @ts-ignore
import NoData from "../../assets/undraw_no_data_re_kwbl.svg";
import Modal from "../../components/modal";
import Select from "../../components/select";

function CredentialTypes() {
    const { credentialTypes, isCTLoading, deleteCtype, createCtype, organizations } = useContext(DataContext);

    const [createModalOpen, setCreateModalOpen] = useState(false);
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

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [toDelete, setToDelete] = useState({
        id: -1,
        name: "",
        description: "",
        orgUri: "",
        orgId: -1,
    });

    function toggleCreateOpenModal() {
        setCreateModalOpen(!createModalOpen);
    }

    function toggleDeleteOpen() {
        setDeleteModalOpen(!deleteModalOpen);
    }

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setCreateCtypeForm({ ...createCtypeForm, [name]: checked });
            return;
        }
        setCreateCtypeForm({ ...createCtypeForm, [name]: value });
    }

    function handleCreateCtype(e) {
        e.preventDefault();
        toggleCreateOpenModal();
        const { id, ...others } = createCtypeForm;
        createCtype({ ...others });
    }

    function toNumber(number) {
        const toUnit = ethers.utils.formatEther(number).toString();
        const roundedCount = Math.round(parseFloat(toUnit) * 10 ** 18);
        return roundedCount;
    }

    function handleDelete() {
        const organizationId = toNumber(toDelete.orgId);
        const ctypeId = toNumber(toDelete.id);
        deleteCtype({ organizationId, ctypeId });
    }

    function handlePropsChange() {}

    const updateHash = useCallback(() => {
        if (createCtypeForm.propertiesURI !== "") {
            const hash = ethers.utils.sha256(ethers.utils.toUtf8Bytes(createCtypeForm.propertiesURI));
            setCreateCtypeForm({ ...createCtypeForm, propertiesHash: hash });
        }
    }, [createCtypeForm, setCreateCtypeForm]);

    useEffect(() => {
        updateHash();
    }, [createCtypeForm.propertiesURI]);

    return (
        <div className="overflow-x-auto w-full mt-4">
            {isCTLoading && <progress className="progress w-56" />}

            {!isCTLoading && credentialTypes?.length === 0 && (
                <div className="w-full h-[50vh] flex flex-col place-content-center place-items-center gap-6">
                    <Image src={NoData} alt="" width="176px" />
                    <h1 className="text-lg">No data recorded yet</h1>
                    <button className="btn btn-primary text-primary-content" onClick={toggleCreateOpenModal}>
                        Insert
                    </button>
                </div>
            )}

            {!isCTLoading && credentialTypes?.length > 0 && (
                <div className="w-full flex place-items-center py-4">
                    <div className="flex-grow">
                        <h1 className="text-xl font-bold">Created credential types</h1>
                    </div>
                    <div>
                        <button className="btn" onClick={toggleCreateOpenModal}>
                            Create organization
                        </button>
                    </div>
                </div>
            )}
            {!isCTLoading && credentialTypes?.length > 0 && (
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox" className="checkbox" />
                                </label>
                            </th>
                            <th>organizationId</th>
                            <th>propertiesURI</th>
                            <th>propertiesHash</th>
                            <th>transferable</th>
                            <th>revokable</th>
                            <th>expirable</th>
                            <th>lifespan</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {credentialTypes &&
                            credentialTypes?.length > 0 &&
                            credentialTypes?.map((org) => (
                                <TableRow
                                    key={org.name}
                                    data={org}
                                    handleDelete={handleDelete}
                                    toggleDeleteOpen={toggleDeleteOpen}
                                    setToDelete={setToDelete}
                                />
                            ))}
                    </tbody>

                    <tfoot>
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox" className="checkbox" />
                                </label>
                            </th>
                            <th>organizationId</th>
                            <th>propertiesURI</th>
                            <th>propertiesHash</th>
                            <th>transferable</th>
                            <th>revokable</th>
                            <th>expirable</th>
                            <th>lifespan</th>
                            <th></th>
                        </tr>
                    </tfoot>
                </table>
            )}

            {/* 
            organizationId: -1,
            propertiesURI: "",
            propertiesHash: "",
            transferable: false,
            revokable: false,
            expirable: false,
            lifespan: 0, 
            */}

            <Modal open={createModalOpen} toggle={toggleCreateOpenModal}>
                <form className="form-control w-full" onSubmit={handleCreateCtype}>
                    <label className="label">
                        <span className="label-text">Organization</span>
                    </label>
                    <div className="dropdown w-full">
                        <label tabIndex={0} className="input-group input m-0 p-0">
                            <input
                                name="organizationId"
                                type="text"
                                placeholder="Type"
                                className="input w-full flex-grow"
                                value={
                                    createCtypeForm.organizationId !== -1
                                        ? organizations.filter((o) => o.id == createCtypeForm.organizationId)[0].name
                                        : ""
                                }
                                readOnly={true}
                            />
                            <span className="bg-transparent">
                                <VscChevronDown />
                            </span>
                        </label>
                        <div
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
                        </div>
                    </div>
                    <label className="label">
                        <span className="label-text">Schema URL</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Type here"
                        className="input input-bordered w-full"
                        name="propertiesURI"
                        value={createCtypeForm.propertiesURI}
                        onChange={handleChange}
                    />
                    <label className="label">
                        <span className="label-text">Schema hash</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Type here"
                        className="input input-bordered w-full"
                        name="propertiesHash"
                        value={createCtypeForm.propertiesHash}
                        readOnly={true}
                    />
                    <div>
                        <label className="cursor-pointer label">
                            <span className="label-text">Expirable</span>
                            <input
                                type="checkbox"
                                defaultChecked={false}
                                className="checkbox checkbox-accent"
                                name="expirable"
                                checked={createCtypeForm.expirable}
                                onChange={handleChange}
                            />
                        </label>
                        {createCtypeForm.expirable && (
                            <input
                                type="number"
                                placeholder="Number of days to expire"
                                className="input input-bordered w-full"
                                name="lifespan"
                                value={createCtypeForm.lifespan}
                                onChange={handleChange}
                            />
                        )}
                    </div>

                    <div>
                        <label className="cursor-pointer label">
                            <span className="label-text">Transferable</span>
                            <input
                                type="checkbox"
                                className="checkbox checkbox-accent"
                                name="transferable"
                                checked={createCtypeForm.transferable}
                                onChange={handleChange}
                            />
                        </label>
                        <label className="cursor-pointer label">
                            <span className="label-text">Revokable</span>
                            <input
                                type="checkbox"
                                defaultChecked={false}
                                className="checkbox checkbox-accent"
                                name="revokable"
                                checked={createCtypeForm.revokable}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <input type="submit" className="btn mt-4" value="Create" />
                </form>
            </Modal>

            <Modal open={deleteModalOpen} toggle={toggleDeleteOpen}>
                <div className="w-full flex flex-col space-y-6 ">
                    <h2 className="text-2xl font-bold ">Warning!</h2>
                    <div className="text-left">
                        <p>
                            <span className="font-bold text-error">{toDelete.name}</span> is about to be removed
                            permanently! Are your sure you you want to delete?
                        </p>
                    </div>
                    <div className="w-full card-actions flex">
                        <button
                            className="btn btn-success flex-grow"
                            onClick={() => {
                                toggleDeleteOpen();
                                setToDelete({
                                    id: -1,
                                    name: "",
                                    description: "",
                                    orgUri: "",
                                });
                            }}
                        >
                            CANCEL
                        </button>
                        <button
                            className="btn btn-outline btn-error flex-grow"
                            onClick={() => {
                                toggleDeleteOpen();
                                handleDelete();
                            }}
                        >
                            DELETE
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

CredentialTypes.Layout = MainLayout;

export default CredentialTypes;

function TableRow({ data, handleDelete, toggleDeleteOpen, setToDelete }) {
    const { organizations } = useContext(DataContext);

    function toNumber(number) {
        const toUnit = ethers.utils.formatEther(number).toString();
        const roundedCount = Math.round(parseFloat(toUnit) * 10 ** 18);
        return roundedCount;
    }
    function shorten_address(pubkey) {
        let shorten = "";
        if (pubkey) {
            const length = pubkey.length;
            let front = pubkey.substring(0, 10);
            let back = pubkey.substring(length - 8);
            shorten = `${front}...${back}`;
        }

        return shorten;
    }

    const orgName = (id) => {
        if (organizations) {
            const org = organizations.filter((o) => toNumber(o.id) === id);
            return org[0]?.name || "";
        }
    };

    return (
        <tr>
            <th>
                <label>
                    <input type="checkbox" className="checkbox" />
                </label>
            </th>
            <th>{orgName(data.id)}</th>

            <th>{data.propertiesURI}</th>
            <th>{shorten_address(data.propertiesHash)}</th>
            <th>
                <input
                    type="checkbox"
                    className="checkbox checkbox-accent"
                    name="revokable"
                    checked={data.transferable}
                    readOnly
                />
            </th>
            <th>
                <input
                    type="checkbox"
                    className="checkbox checkbox-accent"
                    name="revokable"
                    checked={data.revokable}
                    readOnly
                />
            </th>
            <th>
                <input
                    type="checkbox"
                    className="checkbox checkbox-accent"
                    name="revokable"
                    checked={data.expirable}
                    readOnly
                />
            </th>
            <th>{data.expirable ? toNumber(data.lifespan) : "Permanent"}</th>
            <th>
                <button
                    className="btn btn-xs btn-error"
                    onClick={() => {
                        setToDelete(data);
                        toggleDeleteOpen();
                    }}
                >
                    DELETE
                </button>
            </th>
        </tr>
    );
}
