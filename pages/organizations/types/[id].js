/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useContext } from "react";
import { VscChevronDown, VscClose, VscAdd, VscTrash } from "react-icons/vsc";
import { v4 as uid } from "uuid";
import { DataContext } from "../../../contexts/data";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { WalletContext } from "../../../contexts/wallet";
import BtnWithAuth from "../../../hooks/useAuthCallback";

const initialScheme = {
  $id: "https://selendra.org/schema.json",
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "",
  description: "",
  ownerId: "",
  images: [],
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

const CreateType = () => {
  const router = useRouter();
  const { organizations, isOrgLoading, createCtype } = useContext(DataContext);
  const { wallet, publicKey, toggleRequest, show } = useContext(WalletContext);
  const [isChecking, setIsChecking] = React.useState(true);
  const [org, setOrg] = useState({
    name: "",
  });

  const [images, setImages] = useState([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const [schema, setSchema] = useState(initialScheme);
  const [propsArray, setPropsArray] = useState([initialState()]);
  const [propsObject, setPropsObject] = useState({});

  const [createCtypeForm, setCreateCtypeForm] = useState({
    organizationId: -1,
    propertiesURI: "",
    propertiesHash: "",
    transferable: false,
    revokable: false,
    expirable: false,
    lifespan: 0,
  });

  const { id } = router.query;

  function toNumber(number) {
    const toUnit = ethers.utils.formatEther(number).toString();
    const roundedCount = Math.round(parseFloat(toUnit) * 10 ** 18);
    return roundedCount;
  }

  function handleCtypeFormChange(e) {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setCreateCtypeForm({ ...createCtypeForm, [name]: checked });
      return;
    }
    setCreateCtypeForm({ ...createCtypeForm, [name]: value });
  }

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
    if (name === "type") {
      const v = JSON.parse(value);
      setPropsArray((prev) => prev.map((n) => (n.id === id ? { ...n, [name]: v.value, label: v.label } : n)));
      return;
    }
    // const data = JSON.parse(e.target.value);
    // console.log(data);
    setPropsArray((prev) => prev.map((n) => (n.id === id ? { ...n, [name]: value } : n)));
  }

  async function prepareSchema() {
    const _org = org.name.trim().replace(/\s/g, "").toLocaleLowerCase();
    const _title = schema.title.trim().replace(/\s/g, "").toLocaleLowerCase();

    const _schema = schema;
    _schema["$id"] = `https://did.selendra.org/${_org}/${_title}.schema.json`;
    _schema["properties"] = propsObject;
    return _schema;
  }

  function handleSelectFiles(e) {
    const files = e.target.files;
    let _files = [];

    for (let i = 0; i < files.length; i++) {
      _files.push(files[i]);
    }

    setImages(_files);
  }

  function handleUploadImages(e) {
    if (e) e.preventDefault();

    if (images.length === 0) return;

    setIsUploadingImages(true);

    let formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append(i.toString(), images[i], images[i].name);
    }

    var requestOptions = {
      method: "POST",
      body: formData,
    };

    return fetch("https://gateway.kumandra.org/api/add", requestOptions)
      .then((response) => response.text())
      .then((response) => {
        const data = response.split("\n");

        let urls = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i] !== "") {
            let _d = JSON.parse(data[i]);
            urls.push(`https://gateway.kumandra.org/files/${_d.Hash}`);
          }
        }
        return urls;
      })
      .catch((error) => null);
  }

  async function upload(formData) {
    const _title = schema.title.replace(/\s/g, "").toLocaleLowerCase();

    const str = JSON.stringify(formData);
    var strblob = new Blob([str], { type: "text/plain" });

    var formdata = new FormData();
    formdata.append("file", strblob, `${_title}.schema.json`);

    var requestOptions = {
      method: "POST",
      body: formdata,
    };

    return await fetch("https://gateway.kumandra.org/api/add", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const data = result.split("\n");
        const _obj = JSON.parse(data[0]);
        const propertiesURI = `https://gateway.kumandra.org/files/${_obj.Hash}`;
        const propertiesHash = ethers.utils.sha256(ethers.utils.toUtf8Bytes(propertiesURI));
        console.log({ ...createCtypeForm, propertiesURI, propertiesHash });
        createCtype({ ...createCtypeForm, propertiesURI, propertiesHash, organizationId: parseInt(id) });
      })
      .then(() => true)
      .catch((error) => false);
  }

  const arrayToObject = React.useCallback(() => {
    const obj = {};
    for (let i = 0; i < propsArray.length; i++) {
      const name = propsArray[i].name;
      const type = propsArray[i].type;
      const description = propsArray[i].descriptions;
      const label = propsArray[i].label;
      obj[name] = { type, description, label };
    }
    return obj;
  }, [propsArray]);

  const handleCreateCtype = async () => {
    const _schema = await prepareSchema();
    const urls = await handleUploadImages();
    // @ts-ignore
    _schema["images"] = urls;
    setSchema(_schema);
    setTimeout(() => {}, 1000);
    const uploading = await upload(schema);
    if (uploading) {
      router.push(`/organizations/${id}`);
    }
  };

  useEffect(() => {
    const o = arrayToObject();
    setPropsObject(o);
  }, [arrayToObject]);

  useEffect(() => {
    if (!isOrgLoading && organizations && organizations.length > 0 && isChecking) {
      const _org = organizations.filter((o) => id === toNumber(o.id).toString());
      if (_org.length === 0) {
        router.push("/organizations");
      }
      setOrg(_org[0]);
      setIsChecking(false);
    }
  }, [organizations, isOrgLoading, isChecking, setIsChecking, setOrg, id, router]);

  useEffect(() => {
    if (publicKey) {
      if (schema.ownerId === "") {
        setSchema({ ...schema, ownerId: publicKey });
      }
    }
  }, [publicKey, schema, setSchema]);

  useEffect(() => {
    if (createCtypeForm.organizationId === -1) {
      setCreateCtypeForm({ ...createCtypeForm, organizationId: parseInt(id) });
    }
  }, [createCtypeForm, id, setCreateCtypeForm]);

  useEffect(() => {
    if (!wallet && !show) {
      toggleRequest();
    }
  }, [wallet, toggleRequest, show]);

  useEffect(() => {
    console.log(propsObject);
  }, [propsObject]);

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
            <br />
            <div>
              <label className="cursor-pointer label">
                <span className="label-text text-base">Expirable</span>
                <input
                  type="checkbox"
                  className="checkbox checkbox-accent"
                  name="expirable"
                  checked={createCtypeForm.expirable}
                  onChange={handleCtypeFormChange}
                />
              </label>
              {createCtypeForm.expirable && (
                <input
                  type="number"
                  placeholder="Number of days to expire"
                  className="input input-bordered w-full"
                  name="lifespan"
                  value={createCtypeForm.lifespan}
                  onChange={handleCtypeFormChange}
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
                  checked={createCtypeForm.transferable}
                  onChange={handleCtypeFormChange}
                />
              </label>
              <label className="cursor-pointer label">
                <span className="label-text text-base">Revokable</span>
                <input
                  type="checkbox"
                  className="checkbox checkbox-accent"
                  name="revokable"
                  checked={createCtypeForm.revokable}
                  onChange={handleCtypeFormChange}
                />
              </label>
            </div>
            <br />
            <div className="flex justify-between p-1 rounded-xl">
              <h3>Images</h3>
              <div className="flex space-x-4">
                <label className="btn rounded-xl modal-button ml-2" htmlFor="formFile">
                  Add images
                  <input
                    type="file"
                    id="formFile"
                    placeholder="No files chosen"
                    className="input input-bordered hidden"
                    multiple={true}
                    onChange={handleSelectFiles}
                  />
                </label>
                {images && images.length > 0 && (
                  <button className="btn btn-primary rounded-xl" onClick={handleUploadImages}>
                    Upload
                  </button>
                )}
                {images && images.length > 0 && (
                  <button className="btn btn-error rounded-xl" onClick={() => setImages([])}>
                    Clear
                  </button>
                )}
              </div>
            </div>
            <br />
            {images && images.length > 0 && (
              <div className="carousel carousel-center h-64 p-4 space-x-4 rounded-box bg-base-300 justify-start">
                {images.map((img, index) => {
                  return (
                    <div key={index} className="carousel-item">
                      <img src={URL.createObjectURL(img)} alt="" className="rounded-box w-full" />
                    </div>
                  );
                })}
              </div>
            )}

            <br />
            <div>
              <h1 className="font-bold">Properties</h1>
            </div>

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

        <button
          onClick={handleCreateCtype}
          className="btn btn-block bg-accent text-white font-bold rounded-b-lg no-animation h-12"
        >
          SUBMIT
        </button>
      </div>
    </>
  );
};

export default CreateType;

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
    { label: "Images", value: "array", default: false },
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
              // value={JSON.stringify(data)}
              defaultValue={data.type}
              onChange={(e) => handlePropsChange(e, data.id)}
            >
              <option>Choose a type</option>
              {dataTypes.map((option) => (
                <option key={option.label} value={JSON.stringify(option)}>
                  {option.label}
                </option>
              ))}
            </select>

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
