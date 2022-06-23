import React, { useState, useEffect } from "react";
import Image from "next/image";
import MainLayout from "../../components/mainLayout";
import { MdClose, MdAdd } from "react-icons/md";
import Collapse from "../../components/collapse";
import Property from "../../components/property";
// import Select from "../../components/select";
import { v4 as uid } from "uuid";
import { VscChevronDown, VscClose, VscAdd, VscTrash } from "react-icons/vsc";

const initialState = () => ({
    id: uid(),
    name: "",
    type: "",
    format: "",
    options: [],
    min: "",
    max: "",
    defaultValue: "",
    required: false,
    description: "",
});

const initialScheme = {
    title: "",
    description: "",
    ownerId: "",
};

function CreateCTypes() {
    const [scheme, setScheme] = useState(initialScheme);
    const [_properties, setProperties] = useState([initialState()]);
    const [selectedType, setSelectedType] = useState("");
    const [selectedFormat, setSelectedFormat] = useState("");

    function removeProp(id) {
        setProperties((prev) => prev.filter((n) => n.id !== id));
    }

    function handlePropsChange(e, id) {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            // <<<<<<< HEAD
            //       setProperties((prev) => prev.map((n) => (n.id === id ? { ...n, [name]: checked } : n)));
            //       return;
            //     }
            //     setProperties((prev) => prev.map((n) => (n.id === id ? { ...n, [name]: value } : n)));
            //   }

            //   function handleAddOption(data, id) {
            //     // @ts-ignore
            //     if (data !== "") {
            //       setProperties((prev) => prev.map((n) => (n.id === id ? { ...n, options: [...n.options, data] } : n)));
            //     }
            //   }

            //   function handleRemoveOption(data, id) {
            //     setProperties((prev) =>
            //       prev.map((n) => (n.id === id ? { ...n, options: n.options.filter((o) => o !== data) } : n))
            //     );
            //   }

            // =======
            setProperties((prev) => prev.map((n) => (n.id === id ? { ...n, [name]: checked } : n)));
            return;
        }
        setProperties((prev) => prev.map((n) => (n.id === id ? { ...n, [name]: value } : n)));
    }

    function handleAddOption(data, id) {
        if (data !== "") {
            // @ts-ignore
            setProperties((prev) => prev.map((n) => (n.id === id ? { ...n, options: [...n.options, data] } : n)));
        }
    }

    function handleRemoveOption(data, id) {
        setProperties((prev) =>
            prev.map((n) => (n.id === id ? { ...n, options: n.options.filter((o) => o !== data) } : n))
        );
    }

    // >>>>>>> origin
    function addProp() {
        setProperties((prev) => [...prev, initialState()]);
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setScheme({ ...scheme, [name]: value });
    }

    useEffect(() => {
        // <<<<<<< HEAD
        // =======
        //     console.clear();
        // >>>>>>> origin/den
        console.log(JSON.stringify(_properties, null, 4));
    }, [_properties]);

    return (
        <div className="w-full mt-4 p-2 flex flex-col space-y-4 overflow-y-visible">
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">Title</span>
                </label>
                <input
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full rounded-none"
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
                    className="textarea textarea-bordered h-24 rounded-none"
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
                    className="input input-bordered w-full rounded-none"
                    name="ownerId"
                    value={scheme.ownerId}
                    onChange={handleChange}
                />
            </div>
            <label className="label">
                <span className="label-text font-bold">Properties</span>
            </label>

            <div className="overflow-x-full h-max">
                <table className="table table-auto w-full border-collapse border border-slate-400">
                    <thead className="text-center">
                        <tr>
                            <th className="border border-slate-300">Name</th>
                            <th className="border border-slate-300">Type</th>
                            <th className="border border-slate-300">Format</th>
                            <th className="border border-slate-300">Options</th>
                            <th className="border border-slate-300">Min</th>
                            <th className="border border-slate-300">Max</th>
                            <th className="border border-slate-300">Default Value</th>
                            <th className="border border-slate-300">Required</th>
                            <th className="border border-slate-300">Description</th>
                            <th className="border border-slate-300"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {_properties.map((pro) => (
                            <NewProperty
                                key={pro.id}
                                data={pro}
                                removeProp={removeProp}
                                handlePropsChange={handlePropsChange}
                                handleAddOption={handleAddOption}
                                handleRemoveOption={handleRemoveOption}
                            />
                        ))}
                        <tr>
                            <td colSpan={10} className="p-0 text-center h-12">
                                {/* <<<<<<< HEAD
                <button className="w-full btn no-animation h-12" onClick={addProp}>
======= */}
                                <button className="w-full btn no-animation h-12" onClick={addProp}>
                                    {/* >>>>>>> origin/den */}
                                    <VscAdd />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

CreateCTypes.Layout = MainLayout;

export default CreateCTypes;

// <<<<<<< HEAD
// const NewProperty = ({ data, removeProp, handlePropsChange, handleAddOption, handleRemoveOption }) => {
// =======
const NewProperty = ({ data, removeProp, handlePropsChange, handleAddOption, handleRemoveOption }) => {
    // >>>>>>> origin/den
    const [newOption, setNewOption] = useState("");

    function handleChange(e) {
        const { value } = e.target;
        setNewOption(value);
    }

    function handleAdd() {
        handleAddOption(newOption, data.id);
        setNewOption("");
    }

    const dataTypes = [
        { label: "Text", value: "string" },
        { label: "Number", value: "number" },
        { label: "Boolean", value: "boolean" },
        { label: "List", value: "array" },
        { label: "Object", value: "object" },
    ];

    const formats = [
        { label: "Date", value: "date" },
        { label: "Time", value: "time" },
        { label: "DateTime", value: "datetime" },
        { label: "Web address", value: "uri" },
    ];
    return (
        <tr>
            <td className="p-0 border border-slate-300">
                <input
                    type="text"
                    id=""
                    placeholder="fristName"
                    className="input  h-12 p-2"
                    name="name"
                    value={data.name}
                    onChange={(e) => handlePropsChange(e, data.id)}
                />
            </td>
            <td className="p-0 border border-slate-300">
                {/* <<<<<<< HEAD
        <Select data={dataTypes} selected={data.type} handlePropsChange={handlePropsChange} name="type" id={data.id} />
======= */}
                <Select
                    data={dataTypes}
                    selected={data.type}
                    handlePropsChange={handlePropsChange}
                    name="type"
                    id={data.id}
                />
                {/* >>>>>>> origin/den */}
            </td>
            <td className="p-0 border border-slate-300">
                <Select
                    data={formats}
                    selected={data.format}
                    handlePropsChange={handlePropsChange}
                    name="format"
                    id={data.id}
                />
            </td>
            <td className="p-0 border border-slate-300">
                <label tabIndex={0} className="input-group input m-0 p-0">
                    <input
                        name="format"
                        type="text"
                        className="input w-full flex-grow h-full"
                        value={newOption}
                        onChange={handleChange}
                    />
                    <span className="bg-transparent" onClick={handleAdd}>
                        <VscAdd />
                    </span>
                </label>
                {data.options.length > 0 && (
                    <ul className="flex flex-col p-2 gap-1">
                        {data.options.map((o) => (
                            <li key={uid()} className="w-full gap-2 flex">
                                <span className="flex-grow">{o}</span>
                                <span>
                                    <VscTrash onClick={() => handleRemoveOption(o, data.id)} />
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </td>
            <td className="p-0 border border-slate-300 ">
                <input
                    type="text"
                    id=""
                    placeholder="0"
                    className="input w-16 h-12 p-2 text-center"
                    disabled={data.type !== "number"}
                    name="min"
                    value={data.min}
                    onChange={(e) => handlePropsChange(e, data.id)}
                />
            </td>
            <td className="p-0 border border-slate-300 ">
                <input
                    type="text"
                    id=""
                    placeholder="100"
                    className="input w-16 h-12 p-2 text-center"
                    name="max"
                    disabled={data.type !== "number"}
                    value={data.max}
                    onChange={(e) => handlePropsChange(e, data.id)}
                />
            </td>
            <td className="p-0  border border-slate-300">
                <input
                    type="text"
                    id=""
                    placeholder="Jonh"
                    className="input  h-12 p-2"
                    name="defaultValue"
                    value={data.defaultValue}
                    onChange={(e) => handlePropsChange(e, data.id)}
                />
            </td>
            <td className="p-0 text-center border border-slate-300">
                <input
                    type="checkbox"
                    defaultChecked={false}
                    className="checkbox checkbox-md"
                    name="required"
                    checked={data.required}
                    onChange={(e) => handlePropsChange(e, data.id)}
                />
            </td>
            <td className="p-0  border border-slate-300">
                <input
                    type="text"
                    id=""
                    placeholder="People's first name"
                    className="input  h-12 p-2"
                    name="description"
                    value={data.description}
                    onChange={(e) => handlePropsChange(e, data.id)}
                />
            </td>
            <td className="py-0 px-2  border border-slate-300">
                {/* <<<<<<< HEAD
        <button className="btn btn-xs btn-error btn-square" onClick={() => removeProp(data.id)}>
======= */}
                <button className="btn btn-xs btn-error btn-square" onClick={() => removeProp(data.id)}>
                    {/* >>>>>>> origin/den */}
                    <VscClose />
                </button>
            </td>
        </tr>
    );
};

function Select({ id, data, selected, handlePropsChange, name }) {
    const [selectedLabel, setSeletedLabel] = useState("");
    useEffect(() => {
        const s = data.filter((l) => l.value === selected);
        if (s.length > 0) {
            setSeletedLabel(s[0].label);
        }
    }, [data, selected, setSeletedLabel]);
    return (
        <div className="dropdown w-full">
            <label tabIndex={0} className="input-group input m-0 p-0">
                <input
                    name="format"
                    type="text"
                    placeholder={name}
                    className="input w-full flex-grow h-full"
                    value={selectedLabel || ""}
                    readOnly={true}
                />
                <span className="bg-transparent">
                    <VscChevronDown />
                </span>
            </label>
            {/* <<<<<<< HEAD
      <div tabIndex={0} className="w-full dropdown-content menu p-0 shadow-lg bg-base-100 rounded-box mb-2">
        {data.map((opt) => (
          <label key={uid()} className="label cursor-pointer hover:bg-blue-300 p-2 transition-all">
======= */}
            <div tabIndex={0} className="w-full dropdown-content menu p-0 shadow-lg bg-base-100 rounded-box mb-2">
                {data.map((opt) => (
                    <label key={uid()} className="label cursor-pointer hover:bg-blue-300 p-2 transition-all">
                        {/* >>>>>>> origin/den */}
                        <span className="label-text">{opt.label}</span>
                        <input
                            type="radio"
                            name={name}
                            className="radio checked:bg-blue-500"
                            checked={selected === opt.value}
                            value={opt.value}
                            onChange={(e) => handlePropsChange(e, id)}
                        />
                    </label>
                ))}
            </div>
        </div>
    );
}
