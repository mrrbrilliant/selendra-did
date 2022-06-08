import React, { useState, useEffect } from "react";
import Image from "next/image";
import MainLayout from "../../components/mainLayout";
import { MdClose, MdAdd } from "react-icons/md";
import Collapse from "../../components/collapse";
import Property from "../../components/property";
import { v4 as uid } from "uuid";

const initialState = () => ({
    id: uid(),
    title: "Default title",
    reference: "",
    type: "",
    format: "",
    identifier: "",
});

const initialScheme = {
    title: "",
    description: "",
    ownerId: "",
};

function CreateCTypes() {
    const [scheme, setScheme] = useState(initialScheme);
    const [_properties, setProperties] = useState([initialState()]);

    function removeProp(id) {
        setProperties((prev) => prev.filter((n) => n.id !== id));
    }

    function handlePropsChange(e, id) {
        const { name, value } = e.target;
        setProperties((prev) => prev.map((n) => (n.id === id ? { ...n, [name]: value } : n)));
    }

    function addProp() {
        setProperties((prev) => [...prev, initialState()]);
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setScheme({ ...scheme, [name]: value });
    }

    return (
        <div className="overflow-x-auto w-full mt-4 p-2 flex flex-col space-y-4">
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">Title</span>
                </label>
                <input
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full"
                    name="title"
                    value={scheme.title}
                    onChange={handleChange}
                />
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Description</span>
                    <label className="label">
                        <span>
                            <label className="label cursor-pointer">
                                <span className="label-text mr-4">Enable</span>
                                <input type="checkbox" className="toggle  toggle-xs" checked />
                            </label>
                        </span>
                    </label>
                </label>
                <textarea
                    className="textarea textarea-bordered h-24"
                    placeholder="Bio"
                    name="description"
                    value={scheme.description}
                    onChange={handleChange}
                ></textarea>
            </div>
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">Owner ID</span>
                    <label className="label">
                        <span>
                            <label className="label cursor-pointer">
                                <span className="label-text mr-4">Enable</span>
                                <input type="checkbox" className="toggle  toggle-xs" checked />
                            </label>
                        </span>
                    </label>
                </label>
                <input
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full"
                    name="ownerId"
                    value={scheme.ownerId}
                    onChange={handleChange}
                />
            </div>
            <label className="label">
                <span className="label-text font-bold">Properties</span>
            </label>
            {_properties.map((pro) => (
                <Collapse removeProp={removeProp} key={pro.id} title={pro.title} id={pro.id}>
                    <Property data={pro} handlePropsChange={handlePropsChange} />
                </Collapse>
            ))}
            <label className="label">
                <span className="label-text font-bold"></span>
                <button className="btn btn-sm gap-2" onClick={addProp}>
                    <MdAdd size={16} />
                    Add property
                </button>
            </label>
            <div className="flex space-x-4 place-content-end">
                <button className="btn btn-ghost btn-error text-error-content">CANCEL</button>
                <button className="btn btn-primary text-primary-content">SUBMIT</button>
            </div>
        </div>
    );
}

CreateCTypes.Layout = MainLayout;

export default CreateCTypes;
