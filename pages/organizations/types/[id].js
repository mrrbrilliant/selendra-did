/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useContext, useCallback } from "react";
import { VscChevronDown, VscClose, VscAdd, VscTrash, VscInfo } from "react-icons/vsc";
import { v4 as uid } from "uuid";
import { DataContext } from "../../../contexts/data";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { WalletContext } from "../../../contexts/wallet";

import Modal from "../../../components/modal";

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

  // const [images, setImages] = useState([]);
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

  const [createCtypeModalOpen, setCreateCtypeModalOpen] = useState(false);
  const [valid, setValid] = useState(false);

  const { id } = router.query;

  function toggleCreateOpenModal() {
    setCreateCtypeModalOpen(!createCtypeModalOpen);
  }

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
    e.preventDefault();
    const files = e.target.files;
    let _files = [];

    for (let i = 0; i < files.length; i++) {
      _files.push(files[i]);
    }

    // setImages(_files);
    handleUploadImages(_files);
  }

  function handleUploadImages(_images) {
    if (_images.length === 0) return;

    setIsUploadingImages(true);

    let formData = new FormData();
    for (let i = 0; i < _images.length; i++) {
      formData.append(i.toString(), _images[i], _images[i].name);
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
        setSchema({ ...schema, images: urls });
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
    // const urls = await handleUploadImages();
    // @ts-ignore
    // _schema["images"] = urls;
    setSchema({ ...schema, ..._schema });
    setTimeout(() => {}, 1000);
    const uploading = await upload(schema);
    if (uploading) {
      router.push(`/organizations/${id}`);
    }
  };

  function isPermanentID() {
    const { transferable, expirable, revokable } = createCtypeForm;
    return !transferable && !expirable && !revokable;
  }

  function isExpirableID() {
    const { transferable, expirable, revokable } = createCtypeForm;
    return !transferable && !revokable && expirable;
  }

  function isRevokableID() {
    const { transferable, expirable, revokable } = createCtypeForm;
    return !transferable && !expirable && revokable;
  }

  function isRevokableAndExpirableID() {
    const { transferable, expirable, revokable } = createCtypeForm;
    return !transferable && expirable && revokable;
  }

  function isAsset() {
    const { transferable, expirable, revokable } = createCtypeForm;
    return transferable && !expirable && !revokable;
  }

  function checkPermanentID() {
    setCreateCtypeForm({
      ...createCtypeForm,
      lifespan: 0,
      transferable: false,
      expirable: false,
      revokable: false,
    });
  }

  function checkRevokable() {
    setCreateCtypeForm({
      ...createCtypeForm,
      lifespan: 0,
      transferable: false,
      expirable: false,
      revokable: true,
    });
  }

  function checkExpirableID() {
    setCreateCtypeForm({
      ...createCtypeForm,
      lifespan: 0,
      transferable: false,
      revokable: false,
      expirable: true,
    });
  }

  function checkRevokableAndExpirableID() {
    setCreateCtypeForm({
      ...createCtypeForm,
      lifespan: 0,
      transferable: false,
      revokable: true,
      expirable: true,
    });
  }

  function checkAsset() {
    setCreateCtypeForm({
      ...createCtypeForm,
      lifespan: 0,
      transferable: true,
      expirable: false,
      revokable: false,
    });
  }

  const validateCreate = useCallback(() => {
    const _valid_schema = schema.description !== "" && schema.ownerId !== "" && schema.images.length > 0;
    const _props = propsArray.map((a) => a.name !== "" && a.type !== "" && a.descriptions !== "");
    const _valid_props = _props.includes(false);
    const _valid = _valid_schema && !_valid_props;
    console.log(_valid);
    setValid(_valid);
  }, [schema, propsArray, setValid]);

  useEffect(() => {
    validateCreate();
  }, [validateCreate]);

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

  // useEffect(() => {
  //   console.log(propsObject);
  // }, [propsObject]);

  // useEffect(() => {
  //   console.log(schema);
  // }, [schema]);

  return (
    <div className="">
      <Modal open={createCtypeModalOpen} toggle={toggleCreateOpenModal}>
        <h3 className="font-bold text-lg">Caution!</h3>
        <p className="py-4">Are you sure? Please double check!</p>
        <div className="modal-action">
          <button className="btn btn-success flex-grow" onClick={handleCreateCtype}>
            Create
          </button>
          <button className="btn btn-info flex-grow" onClick={toggleCreateOpenModal}>
            Cancel
          </button>
        </div>
      </Modal>
      <div className="bg-base-100 p-6 rounded-lg">
        <form>
          <div>
            <h1 className="font-bold text-2xl mb-6">Documents Template</h1>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  name="title"
                  value={schema.title}
                  onChange={handleChange}
                  className="w-full p-2 input input-bordered"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">OwnerId</span>
                </label>
                <input
                  name="ownerId"
                  value={schema.ownerId}
                  onChange={handleChange}
                  className="w-full p-2 input input-bordered font-mono"
                  placeholder="OwnerId"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  name="description"
                  value={schema.description}
                  onChange={handleChange}
                  className="w-full p-2 textarea textarea-bordered"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 ">
              <div className="flex">
                <h3 className="flex-grow">Logo</h3>
                {schema.images && schema.images.length > 0 && (
                  <button
                    className="btn btn-xs btn-error rounded-xl"
                    onClick={() => setSchema({ ...schema, images: [] })}
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="w-fulll h-full flex-grow space-x-4 bg-base-200 rounded-lg">
                {!schema.images ||
                  (schema.images.length === 0 && (
                    <label
                      className="btn btn-ghost h-full rounded-xl modal-button flex place-content-center place-items-center"
                      htmlFor="formFile"
                    >
                      Add Logo
                    </label>
                  ))}
                <input
                  type="file"
                  id="formFile"
                  placeholder="No files chosen"
                  className="input input-bordered hidden"
                  multiple={false}
                  onChange={handleSelectFiles}
                />

                {schema.images && schema.images.length > 0 && (
                  <div className="carousel carousel-center h-64 p-4 space-x-4 rounded-box justify-center">
                    {schema.images.map((img, index) => {
                      return (
                        <div key={index} className="carousel-item">
                          <img src={img} alt="" className="rounded-box w-full" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <h1 className="font-bold text-2xl my-6">Category</h1>
          </div>

          <div className="w-full h-16 grid grid-cols-5 gap-6 mt-6">
            <label
              htmlFor="radio-1"
              className="h-full input input-bordered rounded-xl overflow-hidden flex place-items-center p-6 cursor-pointer relative"
            >
              <input
                type="radio"
                id="radio-1"
                name="radio-4"
                className="checkbox checkbox-accent peer z-10"
                checked={isPermanentID()}
                onChange={checkPermanentID}
              />
              <span className="ml-6 flex-grow z-10 peer-checked:font-bold">Permanent ID</span>

              <div className="w-full h-full left-0 top-0 absolute peer-checked:bg-accent opacity-20 z-0"></div>
            </label>
            <label
              htmlFor="radio-2"
              className="h-full input input-bordered rounded-xl overflow-hidden flex place-items-center p-6 cursor-pointer relative"
            >
              <input
                type="radio"
                id="radio-2"
                name="radio-4"
                className="checkbox checkbox-accent peer z-10"
                checked={isRevokableID()}
                onChange={checkRevokable}
              />
              <span className="ml-6 flex-grow z-10 peer-checked:font-bold">Revokable ID</span>

              <div className="w-full h-full left-0 top-0 absolute peer-checked:bg-accent opacity-20 z-0"></div>
            </label>

            <label
              htmlFor="radio-3"
              className="h-full input input-bordered rounded-xl overflow-hidden flex place-items-center p-6 cursor-pointer relative"
            >
              <input
                type="radio"
                id="radio-3"
                name="radio-4"
                className="checkbox checkbox-accent peer z-10"
                checked={isExpirableID()}
                onChange={checkExpirableID}
              />
              <span className="ml-6 flex-grow z-10 peer-checked:font-bold">Expirable ID</span>
              <div className="w-full h-full left-0 top-0 absolute peer-checked:bg-accent opacity-20 z-0"></div>
            </label>

            <label
              htmlFor="radio-4"
              className="h-full input input-bordered rounded-xl overflow-hidden flex place-items-center p-6 cursor-pointer relative"
            >
              <input
                type="radio"
                id="radio-4"
                name="radio-4"
                className="checkbox checkbox-accent peer z-10"
                checked={isRevokableAndExpirableID()}
                onChange={checkRevokableAndExpirableID}
              />
              <span className="ml-6 flex-grow z-10 peer-checked:font-bold">Revokable and Expirable ID</span>

              <div className="w-full h-full left-0 top-0 absolute peer-checked:bg-accent opacity-20 z-0"></div>
            </label>

            <label
              htmlFor="radio-5"
              className="h-full input input-bordered rounded-xl overflow-hidden flex place-items-center p-6 cursor-pointer relative"
            >
              <input
                type="radio"
                id="radio-5"
                name="radio-4"
                className="checkbox checkbox-accent peer z-10"
                checked={isAsset()}
                onChange={checkAsset}
              />
              <span className="ml-6 flex-grow z-10 peer-checked:font-bold">Digtal Asset (NFT)</span>
              <div className="w-full h-full left-0 top-0 absolute peer-checked:bg-accent opacity-20 z-0"></div>
            </label>
          </div>

          <br />
          {isPermanentID() && (
            <div className="alert alert-warning bg-opacity-50">
              <div>
                <VscInfo size={32} />
                <div>
                  <h3 className="font-bold">Permanent ID</h3>
                  <div className="text-sm">
                    <p>
                      Documents minted on this type will never expire. The owner owns the identity wholely, however, the
                      owner cannot transfer it to other party. The attestation issuer, organization, cannot invalidate,
                      unverify or revoke the documents.
                    </p>
                    <br />
                    <ul className="flex space-x-2">
                      <li className="font-bold">Examples: </li>
                      <li>National ID card,</li>
                      <li>Educational certificates</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isRevokableID() && (
            <div className="alert alert-warning bg-opacity-50">
              <div>
                <VscInfo size={32} />
                <div>
                  <h3 className="font-bold">Revokable ID</h3>
                  <div className="text-sm">
                    <p>
                      Documents minted on this type will never expire. The owner does not own the identity wholely, and
                      the owner cannot transfer it to other party. The attestation issuer, organization, can invalidate,
                      unverify or revoke the documents.
                    </p>

                    <br />
                    <ul className="flex space-x-2">
                      <li className="font-bold">Examples: </li>
                      <li>Employment contracts</li>
                      <li>Business licences</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isExpirableID() && (
            <div className="alert alert-warning bg-opacity-50">
              <div>
                <VscInfo size={32} />
                <div>
                  <h3 className="font-bold">Expirable ID</h3>
                  <div className="text-sm">
                    <p>
                      Documents minted on this type will expire after a specific duration limited by the organization.
                      The owner owns the identity wholely, but the owner cannot transfer it to other party. The
                      attestation issuer, organization, cannot invalidate, unverify or revoke the documents.
                    </p>

                    <br />
                    <ul className="flex space-x-2">
                      <li className="font-bold">Examples: </li>
                      <li>Cinema tickets</li>
                      <li>Membership subscription</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isRevokableAndExpirableID() && (
            <div className="alert alert-warning bg-opacity-50">
              <div>
                <VscInfo size={32} />
                <div>
                  <h3 className="font-bold">Revokable and Expirable ID</h3>
                  <div className="text-sm">
                    <p>
                      Documents minted on this type will expire after a specific duration limited by the organization.
                      The owner does not own the identity wholely, and the owner cannot transfer it to other party. The
                      attestation issuer, organization, can invalidate, unverify or revoke the documents.
                    </p>

                    <br />
                    <ul className="flex space-x-2">
                      <li className="font-bold">Examples: </li>
                      <li>Driving licence</li>
                      <li>Scolarship</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isAsset() && (
            <div className="alert alert-warning bg-opacity-50">
              <div>
                <VscInfo size={32} />
                <div>
                  <h3 className="font-bold">Digtal Asset (NFT)</h3>
                  <div className="text-sm">
                    <p>
                      The owner owns the asset wholely and the owner can transfer the ownership to other party. It will
                      never be expired. It cannot be invalidated, unverified or revoked by the attestation issuer,
                      organization.
                    </p>

                    <br />
                    <ul className="flex space-x-2">
                      <li className="font-bold">Examples: </li>
                      <li>Digital tokens</li>
                      <li>Land title</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {createCtypeForm.expirable && (
            <div>
              <label className="label">
                <span className="label-text">How many days will this document expired after creating date?</span>
              </label>
              <input
                name="lifespan"
                type="number"
                step={1}
                min={1}
                value={createCtypeForm.lifespan}
                onChange={handleCtypeFormChange}
                className="w-full p-2 input input-bordered"
              />
              <label className="label">
                <span className="label-text text-error">
                  Confirmatation! This document will expire in {createCtypeForm.lifespan} days after created!
                </span>
              </label>
            </div>
          )}
          <br />

          <div>
            <h1 className="font-bold text-2xl my-6">Properties</h1>
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
        <button className="w-full btn btn-outline font-bold rounded-lg no-animation h-12 my-6" onClick={addProp}>
          Add property
        </button>

        <button onClick={toggleCreateOpenModal} className="btn btn-block border-none" disabled={!valid}>
          SUBMIT
        </button>
      </div>
    </div>
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
    { label: "True/False", value: "boolean", default: false },
    { label: "List", value: "array", default: false },
    { label: "Object", value: "object", default: false },
    { label: "Images", value: "array", default: false },
  ];
  const [selected, setSelected] = useState(dataTypes[0].value);

  return (
    <div className="h-max">
      <div className="grid grid-cols-3 gap-7 mt-3">
        <div>
          <label className="label">
            <span className="label-text">Field name</span>
          </label>

          <input
            name="name"
            value={data.name}
            onChange={(e) => handlePropsChange(e, data.id)}
            className="w-full input input-bordered"
            // placeholder="Name"
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Content type</span>
          </label>
          <div className="relative inline-block w-full">
            <select
              name="type"
              className="w-full input input-bordered"
              defaultValue={data.type}
              onChange={(e) => handlePropsChange(e, data.id)}
            >
              <option disabled>Choose a type</option>
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
        <div className="flex place-content-center">
          <div className="w-full">
            <label className="label">
              <span className="label-text">Description</span>
            </label>

            <textarea
              name="descriptions"
              rows={1}
              value={data.descriptions}
              onChange={(e) => handlePropsChange(e, data.id)}
              className="w-full textarea textarea-bordered"
            />
          </div>
          <div className="px-2">
            <button className="btn btn-xs btn-error btn-circle mt-12" onClick={() => removeProp(data.id)}>
              <VscClose size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
