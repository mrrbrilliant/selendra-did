/* eslint-disable @next/next/no-img-element */
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { DataContext } from "../../../contexts/data";
import { ethers } from "ethers";
import ZSchema from "z-schema";
import { WalletContext } from "../../../contexts/wallet";
import { NotificationContext } from "../../../contexts/notification";
import { v4 as uid } from "uuid";
import Papa from "papaparse";
import { ContractContext } from "../../../contexts/contract";

export default function Docs() {
  const {
    credentialTypes,
    isCredentialTypesLoading,
    createDocument,
    organizations,
    isOrgLoading,
    ownOrganizations,
    isOwnOrgLoading,
    ownerOfOrg,
  } = useContext(DataContext);
  const { wallet, publicKey, privateKey, toggleRequest, show } = useContext(WalletContext);
  const { contractRO } = useContext(ContractContext);
  const { notify } = useContext(NotificationContext);

  const [isChecking, setIsChecking] = React.useState(true);
  const [org, setOrg] = useState();
  const [isSearching, setIsSearching] = useState(true);
  const [initiated, setInitiated] = useState(false);
  const [form, setForm] = useState();
  const [formUi, setFormUi] = useState(null);
  const [formData, setFormData] = useState({});
  const [schema, setSchema] = useState({});
  const [errors, setErrors] = useState([]);
  const [isOwnOrg, setIsOwnOrg] = useState(false);
  const [orgOwner, setOrgOwner] = useState("");

  const [attachments, setAttachments] = useState();
  const [csvContent, setCsvContent] = useState("");
  const [bulkData, setBulkData] = useState([]);

  const [document, setDocument] = useState({
    ctypeId: -1,
    to: "",
    name: "",
    propertyURI: "",
    propertyHash: "",
  });

  const router = useRouter();

  const { orgId, type } = router.query;

  function handleSelectFiles(e) {
    const files = e.target.files;
    let _files = [];

    for (let i = 0; i < files.length; i++) {
      _files.push(files[i]);
    }

    setAttachments(_files[0]);
  }

  function parseCSV(_csvContent) {
    const lines = Papa.parse(_csvContent);
    return lines;
  }

  function toNumber(number) {
    const toUnit = ethers.utils.formatEther(number).toString();
    const roundedCount = Math.round(parseFloat(toUnit) * 10 ** 18);
    return roundedCount;
  }

  function initiate(url) {
    fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setFormUi(data);
        setSchema(data);
        const fd = {};
        Object.keys(data.properties).forEach((key) => {
          fd[key] = "";
        });
        setFormData(fd);
      })
      .catch((error) => console.log(error));
  }

  function validate() {
    const validator = new ZSchema({
      ignoreUnresolvableReferences: true,
      noEmptyStrings: true,
      noExtraKeywords: false,
    });

    const valid = validator.validate(formData, schema);
    const _errors = validator.getLastErrors();
    if (_errors) {
      setErrors(_errors);
      return false;
    }
    if (valid) {
      return true;
    }
  }

  function upload() {
    const str = JSON.stringify(formData);
    const strblob = new Blob([str], { type: "text/plain" });

    const formdata = new FormData();
    formdata.append("file", strblob, "file.json");

    const requestOptions = {
      method: "POST",
      body: formdata,
    };

    return fetch("https://gateway.kumandra.org/api/add", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const data = result.split("\n");
        return data.filter((d) => d !== "");
      })
      .catch((error) => {
        throw error;
      });
  }

  function uploadWithParams(data) {
    const str = JSON.stringify(data);
    const strblob = new Blob([str], { type: "text/plain" });

    const formdata = new FormData();
    formdata.append("file", strblob, "file.json");

    const requestOptions = {
      method: "POST",
      body: formdata,
    };

    return fetch("https://gateway.kumandra.org/api/add", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const data = result.split("\n");
        return data.filter((d) => d !== "");
      })
      .catch((error) => {
        throw error;
      });
  }

  function handleDocChange(e) {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setDocument({ ...document, [name]: checked });
      return;
    }
    if (type === "number") {
      setDocument({ ...document, [name]: parseInt(value) || 0 });
      return;
    }
    setDocument({ ...document, [name]: value });
  }

  function handleFormChange(e) {
    const { name, value, type, checked } = e.target;

    if (type === "number") {
      setFormData({ ...formData, [name]: parseInt(value) || 0 });
      return;
    }
    setFormData({ ...formData, [name]: value });
  }

  const handleCreateDoc = async () => {
    const _validate = validate();
    if (!_validate) {
      console.log("Not passed validation");
      return;
    }
    try {
      const data = await upload();
      if (data) {
        const _data = JSON.parse(data[0]);
        const propertyURI = `https://gateway.kumandra.org/files/${_data.Hash}`;
        const propertyHash = ethers.utils.sha256(ethers.utils.toUtf8Bytes(propertyURI));
        const toCreateData = { ...document, propertyURI, propertyHash };

        createDocument({ ...toCreateData });
        router.back();
      }
    } catch (error) {
      console.log(errors);
      return;
    }
  };

  const submitDoc = async (doc) => {
    const signer = new ethers.Wallet(wallet.privateKey);
    const signature = await signer.signMessage("decentralized_identity");
    console.log(signature);

    let myHeaders = new Headers();
    myHeaders.append("Authorization", signature);
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify(doc);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    return fetch("https://attestation.koompi.org/claims/create", requestOptions)
      .then((response) => response.text())
      .then((result) => result)
      .catch((error) => error);
  };

  const handleSubmitDoc = async () => {
    const _validate = validate();

    if (!_validate) {
      console.log("Not passed validation");
      return;
    }

    try {
      const data = await upload();
      if (data) {
        const _data = JSON.parse(data[0]);
        const propertyURI = `https://gateway.kumandra.org/files/${_data.Hash}`;
        const propertyHash = ethers.utils.sha256(ethers.utils.toUtf8Bytes(propertyURI));
        const toCreateData = { ...document, propertyURI, propertyHash, attester: orgOwner };
        const submitted = await submitDoc({ ...toCreateData });
        if (submitted) {
          notify({
            id: uid(),
            status: "success",
            name: "Submitted",
            message: "Attestation request has been submitted!",
          });
        }
        router.back();
      }
    } catch (error) {
      notify({
        id: uid(),
        status: "error",
        name: "Submission Failed",
        message: error.toString(),
      });

      return;
    }
  };

  async function bulkCreate(data) {
    const valids = [];
    const invalids = [];
    for (let row = 0; row < data.length; row++) {
      const { ownerAddress, ...others } = data[row];
      const validator = new ZSchema({
        ignoreUnresolvableReferences: true,
        noEmptyStrings: true,
        noExtraKeywords: true,
      });

      const valid = validator.validate(others, schema);
      const _errors = validator.getLastErrors();
      if (_errors) {
        invalids.push(data[row]);
      }
      if (valid) {
        valids.push(data[row]);
      }
    }

    if (invalids.length > 0) {
      console.log("INVALIDS: ", invalids);
      return;
    }
    const faileds = [];

    for (let row = 0; row < valids.length; row++) {
      setTimeout(async () => {
        const { ownerAddress, ...others } = valids[row];

        try {
          const data = await uploadWithParams(others);
          if (data) {
            const _data = JSON.parse(data[0]);
            const propertyURI = `https://gateway.kumandra.org/files/${_data.Hash}`;
            const propertyHash = ethers.utils.sha256(ethers.utils.toUtf8Bytes(propertyURI));
            const toCreateData = { ...document, to: ownerAddress, propertyURI, propertyHash };

            createDocument({ ...toCreateData });
            notify({
              id: uid(),
              status: "success",
              name: "Document created",
              message: `${row + 1} Document(s) created`,
            });
          }
        } catch (error) {
          faileds.push(valids[row]);
          notify({
            id: uid(),
            status: "error",
            name: "Failed",
            message: `${faileds.length} Document(s) created`,
          });
          return;
        }
      }, row * 5000);
    }
  }

  useEffect(() => {
    if (!isCredentialTypesLoading) {
      if (isSearching && credentialTypes) {
        const { orgId, type } = router.query;

        const _data = credentialTypes.filter((t) => {
          const _orgId = toNumber(t.orgId);
          const _type = toNumber(t.CTypeId);
          const __type = parseInt(type);
          const __orgId = parseInt(orgId);

          return _type === __type && _orgId === __orgId;
        });
        console.log(_data);
        setForm(_data[0]);
        setIsSearching(false);
      }
    }
  }, [isSearching, setIsSearching, isCredentialTypesLoading, credentialTypes, router]);

  useEffect(() => {
    if (!isSearching && form) {
      if (form.propertiesURI && !initiated) {
        initiate(form.propertiesURI);
        setInitiated(true);
      }
    }
  }, [isSearching, form, setInitiated, initiated]);

  useEffect(() => {
    if (formUi) {
      if (formUi.title && document.name === "") {
        setDocument({ ...document, name: formUi.title });
      }
    }
  }, [formUi, setDocument, document]);

  useEffect(() => {
    const { type } = router.query;
    if (type) {
      if (document.ctypeId === -1) {
        setDocument({ ...document, ctypeId: parseInt(type) });
      }
    }
  }, [router, setDocument, document]);

  // get org info of current route
  useEffect(() => {
    if (!isOrgLoading && organizations && organizations.length > 0 && isChecking) {
      const _org = organizations.filter((o) => orgId == toNumber(o.id));
      if (_org.length === 0) {
        // redirect if org 404
        router.push("/organizations");
      }
      setOrg(_org[0]);
      setIsChecking(false);
    }
  }, [organizations, isOrgLoading, isChecking, setIsChecking, setOrg, orgId, router]);

  // check if current org in own org
  useEffect(() => {
    if (ownOrganizations && org) {
      const result = ownOrganizations.filter((o) => o.name === org.name);
      if (result.length === 0) {
        setIsOwnOrg(false);
        return;
      }
      setIsOwnOrg(true);
    }
  }, [org, ownOrganizations]);

  useEffect(() => {
    if (contractRO && orgId) {
      if (orgOwner === "") {
        ownerOfOrg(orgId).then((id) => {
          setOrgOwner(id);
        });
      }
    }
  }, [orgOwner, setOrgOwner, orgId, ownerOfOrg, contractRO]);

  useEffect(() => {
    if (!isOwnOrg && publicKey && document.to === "") {
      setDocument({ ...document, to: publicKey });
    }
  }, [isOwnOrg, document, setDocument, publicKey]);

  useEffect(() => {
    if (attachments) {
      const file_reader = new FileReader();
      let file = "";
      file_reader.onloadend = (data) => {
        const d = data.target?.result;
        setCsvContent(d);
      };
      file_reader.readAsText(attachments);
    }
  }, [attachments]);

  useEffect(() => {
    if (csvContent !== "") {
      const result = parseCSV(csvContent);
      const [headers, ...body] = result.data;
      const data = [];

      for (let row = 0; row < body.length; row++) {
        const obj = {};
        for (let col = 0; col < body[row].length; col++) {
          obj[headers[col]] = body[row][col];
        }
        data.push(obj);
      }

      setBulkData(data);
    }
  }, [csvContent]);

  useEffect(() => {
    if (!wallet && !show) {
      toggleRequest();
    }
  }, [wallet, toggleRequest, show]);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <div className="w-full">
      <div className="flex place-content-between place-items-center">
        <h1 className="uppercase font-bold text-xl">{document.name}</h1>
        <label className="btn" htmlFor="csv">
          Import CSV
        </label>
      </div>

      {bulkData.length === 0 && (
        <div>
          <label className="label" htmlFor="to">
            <span className="label-text uppercase">Owner address</span>
          </label>
          <input
            className="input input-bordered w-full"
            type="text"
            name="to"
            value={document.to}
            onChange={handleDocChange}
            disabled={!isOwnOrg}
          />
          <label className="label" htmlFor="to">
            <span className="label-text">0X000000000000000000000000000000000000</span>
          </label>
          <input
            id="csv"
            name="csv"
            className="input input-bordered w-full hidden"
            type="file"
            accept=".csv"
            // value={document.to}
            // disabled={!isOwnOrg}
            onChange={handleSelectFiles}
          />
        </div>
      )}

      {bulkData.length === 0 &&
        formUi?.properties &&
        Object.keys(formUi?.properties).map((key) => {
          return (
            <div key={key}>
              <label className="label" htmlFor={key}>
                <span className="label-text uppercase">{key}</span>
              </label>

              <InputType
                properties={formUi?.properties}
                name={key}
                value={formData[key]}
                handleFormChange={handleFormChange}
              />
              <label className="label" htmlFor={key}>
                <span className="label-text">{formUi?.properties[key]?.description}</span>
              </label>
            </div>
          );
        })}

      {bulkData.length > 0 &&
        bulkData.map((row, index) => (
          <div key={index}>
            <pre>{JSON.stringify(row)}</pre>
          </div>
        ))}

      {bulkData.length > 0 && (
        <div className="w-full flex justify-end space-x-4">
          {isOwnOrg && (
            <button className="btn" onClick={() => bulkCreate(bulkData)}>
              Create all
            </button>
          )}

          {!isOwnOrg && (
            <button className="btn" onClick={handleSubmitDoc}>
              Submit All
            </button>
          )}
        </div>
      )}

      {bulkData.length === 0 && (
        <div className="w-full flex justify-end space-x-4">
          {isOwnOrg && (
            <button className="btn" onClick={handleCreateDoc}>
              Create
            </button>
          )}

          {!isOwnOrg && (
            <button className="btn" onClick={handleSubmitDoc}>
              Submit Request
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function InputType({ properties, name, value, handleFormChange }) {
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [images, setImages] = useState([]);

  const type = properties[name]?.type || "string";
  const label = properties[name]?.label;

  function handleUploadImages(e) {
    if (e) e.preventDefault();

    console.log(e.target);

    setIsUploadingImages(true);

    let formData = new FormData();
    for (let i = 0; i < e.target.files.length; i++) {
      formData.append(i.toString(), e.target.files[i], e.target.files[i].name);
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
        setImages(urls);
        handleFormChange({ target: { name: e.target.name, value: urls } });
      })
      .catch((error) => null);
  }

  const str_input = (
    <input className="input input-bordered w-full" type="text" name={name} value={value} onChange={handleFormChange} />
  );
  const int_input = (
    <input
      className="input input-bordered w-full"
      type="number"
      name={name}
      value={value}
      onChange={handleFormChange}
    />
  );
  const boolean_input = (
    <input
      className="input input-bordered w-full"
      type="checkbox"
      name={name}
      checked={value}
      onChange={(e) => handleFormChange(e)}
    />
  );

  const images_input = (
    <div className="flex flex-col space-y-4">
      <div className="w-full h-auto input input-bordered">
        <label htmlFor={name} className="w-full h-12 flex place-content-center place-items-center cursor-pointer">
          <input className="hidden" type="file" id={name} name={name} multiple={true} onChange={handleUploadImages} />
          Select images
        </label>
      </div>
      {images && images.length > 0 && (
        <div className="grid grid-cols-4 gap-4 rounded-box">
          {images.map((img, index) => {
            return (
              <div key={index} className="rounded-lg overflow-hidden flex place-items-center place-content-center">
                <img src={img} alt="" className="h-full w-auto" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  if (type === "integer" || type === "number") {
    return int_input;
  }

  if (type === "boolean") {
    return boolean_input;
  }

  if (type === "array" && label === "Images") {
    return images_input;
  }

  return str_input;
}

// const dataTypes = [
//   { label: "Text", value: "string", default: true },
//   { label: "Number", value: "number", default: false },
//   { label: "Boolean", value: "boolean", default: false },
//   { label: "List", value: "array", default: false },
//   { label: "Object", value: "object", default: false },
//   { label: "Images", value: "images", default: false },
// ];
