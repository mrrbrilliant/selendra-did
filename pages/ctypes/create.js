import React, { useState, useEffect, useContext } from "react";
import { VscChevronDown, VscClose, VscAdd, VscTrash } from "react-icons/vsc";
import { v4 as uid } from "uuid";
import { DataContext } from "../../contexts/data";
import { useRouter } from "next/router";

const initialScheme = {
  $id: "https://selendra.org/schema.json",
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "",
  description: "",
  ownerId: "",
};
const initialState = () => ({
  id: uid(),
  name: "",
  type: "",
  descriptions: "",
});
const dataTypes = [
  { label: "Text", value: "string" },
  { label: "Number", value: "number" },
  { label: "Boolean", value: "boolean" },
  { label: "List", value: "array" },
  { label: "Object", value: "object" },
  { label: "Images", value: "images" },
];

const Create1 = () => {
  const { organizations } = useContext(DataContext);

  const [schema, setSchema] = useState(initialScheme);
  const [propsArray, setPropsArray] = useState([initialState()]);
  const [propsObject, setPropsObject] = useState({});

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setSchema({ ...schema, [name]: checked });
      return;
    }
    setSchema({ ...schema, [name]: value });
  }

  function removeProp(id) {
    setPropsArray((prev) => prev.filter((n) => n.id !== id));
  }

  function handleAddOption(data, id) {
    // @ts-ignore
    if (data !== "") {
      setPropsArray((prev) => prev.map((n) => (n.id === id ? { ...n, options: [...n.options, data] } : n)));
    }
  }

  function handleRemoveOption(data, id) {
    setPropsArray((prev) =>
      prev.map((n) => (n.id === id ? { ...n, options: n.options.filter((o) => o !== data) } : n))
    );
  }

  function addProp() {
    setPropsArray((prev) => [...prev, initialState()]);
  }

  function handlePropsChange(e, id) {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setPropsArray((prev) => prev.map((n) => (n.id === id ? { ...n, [name]: checked } : n)));
      return;
    }
    setPropsArray((prev) => prev.map((n) => (n.id === id ? { ...n, [name]: value } : n)));
  }

  function prepareSchema() {
    const schema = schema;
    schema["properties"] = propsObject;
    return schema;
  }

  function upload(formData) {
    const str = JSON.stringify(formData);
    var strblob = new Blob([str], { type: "text/plain" });

    var formdata = new FormData();
    formdata.append("file", strblob, "file.txt");
    formdata.append("field-1", "field-1-data");

    var requestOptions = {
      method: "POST",
      body: formdata,
    };

    fetch("https://gateway.kumandra.org/api/add", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const data = result.split("\n");
        console.log(data[0]);
      })
      .catch((error) => console.log("error", error));
  }

  const arrayToObject = React.useCallback(() => {
    const obj = {};
    for (let i = 0; i < propsArray.length; i++) {
      const name = propsArray[i].name;
      const type = propsArray[i].type;
      const description = propsArray[i].descriptions;
      obj[name] = { type, description };
    }
    return obj;
  }, [propsArray]);

  function uploadSchema() {
    const schema = prepareSchema();
    upload(schema);
  }

  useEffect(() => {
    const o = arrayToObject();
    setPropsObject(o);
  }, [arrayToObject]);

  return (
    <>
      <div className="mb-4">
        <h1 className="font-bold">Create Documents Template</h1>
        <br />
        <div className="bg-base-100 px-8 py-8 rounded-lg">
          <form>
            <div>
              <label className="font-semibold text-accent">Title</label>

              <input
                name="title"
                value={schema.title}
                onChange={handleChange}
                className="bg-gray-200 w-full p-2 rounded text-black"
                placeholder="Title"
              />
            </div>
            <br />
            <div>
              <label className="font-semibold text-accent">Description</label>
              <input
                name="description"
                value={schema.description}
                onChange={handleChange}
                className="bg-gray-200 w-full p-2 rounded text-black"
                placeholder="Description"
              />
            </div>
            <br />
            <div>
              <label className="font-semibold text-accent">OwnerId</label>
              <input
                name="ownerId"
                value={schema.ownerId}
                onChange={handleChange}
                className="bg-gray-200 w-full p-2 rounded text-black"
                placeholder="OwnerId"
              />
            </div>
            <div>
              <label className="cursor-pointer label">
                <span className="label-text text-base">Expirable</span>
                <input
                  type="checkbox"
                  className="checkbox checkbox-accent"
                  name="expirable"
                  checked={schema.expirable}
                  onChange={handleChange}
                />
              </label>
              {schema.expirable && (
                <input
                  type="number"
                  placeholder="Number of days to expire"
                  className="input input-bordered w-full"
                  name="lifespan"
                  value={schema?.lifespan}
                  onChange={handleChange}
                />
              )}
            </div>

            <div>
              <label className="cursor-pointer label">
                <span className="label-text text-base">Transferable</span>
                <input
                  type="checkbox"
                  className="checkbox checkbox-accent"
                  name="transferable"
                  checked={schema.transferable}
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
                  // onChange={handleChangeType}
                />
              </label>
            </div>
            <br />
            <br />
            <div>
              <h1 className="font-bold">Properties</h1>
            </div>
            {/* {propsArray.map((res) => console.log(res))} */}
            {propsArray.map((pro) => (
              <NewProperty
                key={pro.id}
                data={pro}
                removeProp={removeProp}
                handlePropsChange={handlePropsChange}
                handleAddOption={handleAddOption}
                handleRemoveOption={handleRemoveOption}
              />
            ))}
          </form>
          <button className="w-full btn btn-ghost font-bold rounded-lg no-animation h-12 my-4" onClick={addProp}>
            Add property
          </button>
        </div>
        <button className="w-full bg-accent text-white font-bold rounded-b-lg no-animation h-12" onClick={uploadSchema}>
          SUBMIT
        </button>
      </div>
    </>
  );
};

export default Create1;

const NewProperty = ({ data, removeProp, handlePropsChange, handleAddOption, handleRemoveOption }) => {
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
    { label: "Text", value: "string", default: true },
    { label: "Number", value: "number", default: false },
    { label: "Boolean", value: "boolean", default: false },
    { label: "List", value: "array", default: false },
    { label: "Object", value: "object", default: false },
    { label: "Images", value: "images", default: false },
  ];
  const [selected, setSelected] = useState(dataTypes[0].value);

  return (
    <div>
      <div className="grid grid-cols-3 gap-7 mt-3">
        <div>
          <label className="font-semibold text-accent">Name</label>

          <input
            name="name"
            value={data.name}
            onChange={(e) => handlePropsChange(e, data.id)}
            className="bg-gray-200 w-full p-2 rounded text-black"
            placeholder="Name"
          />
        </div>
        <div>
          <label className="font-semibold text-accent">Type</label>
          <div className="relative inline-block w-full text-gray-700">
            <select
              name="type"
              className="w-full h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline"
              value={data.type}
              defaultValue={dataTypes[0].value}
              onChange={(e) => handlePropsChange(e, data.id)}
            >
              <option>Choose a type</option>
              {dataTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {/* <select
              className="w-full h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline"
              placeholder="Regular input"
            >
              {dataTypes.map((res) => {
                return (
                  <>
                    <option value={res.value}>{res.label}</option>
                  </>
                );
              })}
            </select> */}
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                  fillRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex">
          <div>
            <label className="font-semibold text-accent">Description</label>
            <textarea
              name="descriptions"
              value={data.descriptions}
              onChange={(e) => handlePropsChange(e, data.id)}
              className="bg-gray-200 w-full p-2 h-10 rounded text-black"
              placeholder="Description"
            />
          </div>
          <div className=" pt-8 pl-10">
            <button className="btn btn-xs btn-error btn-square" onClick={() => removeProp(data.id)}>
              <VscClose />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
