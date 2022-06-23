import React, { useState, useEffect } from "react";
import ZSchema from "z-schema";

export default function FromJson() {
    const url = "https://gateway.kumandra.org/files/QmYNRH3BGW5pdHEoV9ybRQWt1Y1CYTHAfogBeWNirnN8DC";
    const [formUi, setFormUi] = useState({});
    const [formData, setFormData] = useState({});
    const [schema, setSchema] = useState({});

    function initiate() {
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
            noExtraKeywords: true,
        });
        const valid = validator.validate(formData, schema);
        var errors = validator.getLastErrors();
        if (valid) console.log("Valid: ", valid);
        if (errors) console.log("Errors: ", errors);
    }

    function upload() {
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

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        // const _value = type === "text" ? value.toString() : parseInt(value);
        // setFormData({ ...formData, [name]: value });
        if (type === "number") {
            setFormData({ ...formData, [name]: parseInt(value) || 0 });
            return;
        }
        setFormData({ ...formData, [name]: value });
    }

    useEffect(() => {
        initiate();
    }, []);

    useEffect(() => {
        console.log(formData);
    }, [formData]);

    return (
        <div>
            {formUi?.properties &&
                Object.keys(formUi?.properties).map((key) => {
                    return (
                        <div key={key}>
                            <label className="label" htmlFor={key}>
                                <span className="label-text uppercase">{key}</span>
                            </label>
                            {/* <input
                                name={key}
                                type={formUi?.properties[key].type === "string" ? "text" : "number"}
                                placeholder="Type here"
                                className="input input-bordered w-full"
                                value={formData[key]}
                                onChange={handleChange}
                            /> */}
                            <InputType
                                properties={formUi?.properties}
                                name={key}
                                value={formData[key]}
                                handleChange={handleChange}
                            />
                            <label className="label" htmlFor={key}>
                                <span className="label-text">{formUi?.properties[key]?.description}</span>
                            </label>
                        </div>
                    );
                })}
            <div>
                <button className="btn" onClick={validate}>
                    Validate
                </button>
                <button className="btn" onClick={upload}>
                    Upload
                </button>
            </div>
        </div>
    );
}

function InputType({ properties, name, value, handleChange }) {
    const type = properties[name]?.type || "string";
    // const name = key;
    const label = properties[name]?.label;
    // console.log(key);
    const str_input = (
        <input className="input input-bordered w-full" type="text" name={name} value={value} onChange={handleChange} />
    );
    const int_input = (
        <input
            className="input input-bordered w-full"
            type="number"
            name={name}
            value={value}
            onChange={handleChange}
        />
    );
    const boolean_input = (
        <input
            className="input input-bordered w-full"
            type="checkbox"
            name={name}
            checked={value}
            onChange={(e) => handleChange(e)}
        />
    );

    if (type === "integer" || type === "number") {
        return int_input;
    }

    if (type === "boolean") {
        return boolean_input;
    }

    return str_input;
}
