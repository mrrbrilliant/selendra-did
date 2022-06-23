import React, { useState, useEffect } from "react";
import { VscChevronDown, VscClose, VscAdd, VscTrash } from "react-icons/vsc";
import { v4 as uid } from "uuid";
const initialScheme = {
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
];

const Create1 = () => {
  const [scheme, setScheme] = useState(initialScheme);
  const [_properties, setProperties] = useState([initialState()]);
  function handleChange(e) {
    const { name, value } = e.target;
    setScheme({ ...scheme, [name]: value });
  }
  function removeProp(id) {
    setProperties((prev) => prev.filter((n) => n.id !== id));
  }
  function handleAddOption(data, id) {
    // @ts-ignore
    if (data !== "") {
      setProperties((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, options: [...n.options, data] } : n
        )
      );
    }
  }
  function handleRemoveOption(data, id) {
    setProperties((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, options: n.options.filter((o) => o !== data) } : n
      )
    );
  }
  function handleChangeProperties(e) {
    const { name, value } = e.target;
    setProperties({ ..._properties, [name]: value });
    console.log(value);
  }
  function addProp() {
    setProperties((prev) => [...prev, initialState()]);
  }

  function handlePropsChange(e, id) {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setProperties((prev) =>
        prev.map((n) => (n.id === id ? { ...n, [name]: checked } : n))
      );
      return;
    }
    setProperties((prev) =>
      prev.map((n) => (n.id === id ? { ...n, [name]: value } : n))
    );
  }
  useEffect(() => {
    console.clear();
    console.log(JSON.stringify(_properties, null, 4));
  }, [_properties]);

  return (
    <>
      <div>
        <h1 className="font-bold">Create Credentails Type</h1>
        <br />
        <div className="bg-white px-8 py-8 rounded-lg">
          <form>
            <div>
              <label className="font-semibold text-accent">Title</label>

              <input
                name="title"
                value={scheme.title}
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
                value={scheme.description}
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
                value={scheme.ownerId}
                onChange={handleChange}
                className="bg-gray-200 w-full p-2 rounded text-black"
                placeholder="OwnerId"
              />
            </div>
            <br />
            <br />
            <div>
              <h1 className="font-bold">Properties</h1>
            </div>
            {_properties.map((res) => console.log(res))}
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
          </form>
        </div>
        <button
          className="w-full bg-accent text-white font-bold rounded-b-lg no-animation h-12"
          onClick={addProp}
        >
          Add More
        </button>
      </div>
    </>
  );
};

export default Create1;

const NewProperty = ({
  data,
  removeProp,
  handlePropsChange,
  handleAddOption,
  handleRemoveOption,
}) => {
  console.log(data, "data");
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
              onChange={(e) => handlePropsChange(e, data.id)}
            >
              {dataTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {/* <select
              class="w-full h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline"
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
            <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                  fill-rule="evenodd"
                ></path>
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
            <button
              className="btn btn-xs btn-error btn-square"
              onClick={() => removeProp(data.id)}
            >
              <VscClose />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
