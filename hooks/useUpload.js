import React, { useState } from "react";

export default function useUpload({ formData, isString }) {
  const [response, setResponse] = useState({
    data: null,
    error: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  function upload(formData) {
    let _formData;

    if (!isString) {
      const str = JSON.stringify(formData);
      var strblob = new Blob([str], { type: "text/plain" });
    }
    // const _title = schema.title.replace(/\s/g, "").toLocaleLowerCase();

    //
    //

    // var formdata = new FormData();
    // formdata.append("file", strblob, `${_title}.schema.json`);

    var requestOptions = {
      method: "POST",
      body: _formData,
    };

    fetch("https://gateway.kumandra.org/api/add", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        // const data = result.split("\n");
        // const _obj = JSON.parse(data[0]);
        // const propertiesURI = `https://gateway.kumandra.org/files/${_obj.Hash}`;
        // const propertiesHash = ethers.utils.sha256(ethers.utils.toUtf8Bytes(propertiesURI));
        // setCreateCtypeForm({
        //   ...createCtypeForm,
        //   organizationId: parseInt(id),
        //   propertiesURI,
        //   propertiesHash,
        // });
        // updateHash();
      })
      .catch((error) => setResponse({ ...response, error: error }));
  }

  return;
}
