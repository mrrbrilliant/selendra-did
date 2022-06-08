import React, { Fragment } from "react";

export default function Property({ data, handlePropsChange }) {
    const { id, title, identifier, reference, type, format } = data;
    return (
        <Fragment>
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">Title</span>
                </label>
                <input
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full"
                    name="title"
                    value={title}
                    onChange={(e) => handlePropsChange(e, id)}
                />
            </div>
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">Identifier</span>
                </label>
                <input
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full"
                    name="identifier"
                    value={identifier}
                    onChange={(e) => handlePropsChange(e, id)}
                />
            </div>
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">Reference</span>
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
                    name="reference"
                    value={reference}
                    onChange={(e) => handlePropsChange(e, id)}
                />
            </div>
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">Type</span>
                </label>
                <div className="dropdown dropdown-top">
                    <input tabIndex={0} name="type" className="w-full input input-bordered" value={type} />
                    <div
                        tabIndex={0}
                        className="w-full dropdown-content menu p-2 shadow-lg rounded-box mb-2 bg-base-100 text-neutral-content"
                        onChange={(e) => handlePropsChange(e, id)}
                    >
                        <label className="label cursor-pointer">
                            <span className="label-text">Text</span>
                            <input type="radio" name="type" className="radio checked:bg-blue-500" value="text" />
                        </label>
                        <label className="label cursor-pointer">
                            <span className="label-text">Number</span>
                            <input type="radio" name="type" className="radio checked:bg-blue-500" value="number" />
                        </label>
                        <label className="label cursor-pointer">
                            <span className="label-text">Decimal</span>
                            <input type="radio" name="type" className="radio checked:bg-blue-500" value="decimal" />
                        </label>
                        <label className="label cursor-pointer">
                            <span className="label-text">Yes/No</span>
                            <input type="radio" name="type" className="radio checked:bg-blue-500" value="boolean" />
                        </label>
                    </div>
                </div>
            </div>

            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">Format</span>

                    <label className="label">
                        <span>
                            <label className="label cursor-pointer">
                                <span className="label-text mr-4">Enable</span>
                                <input type="checkbox" className="toggle toggle-xs" checked />
                            </label>
                        </span>
                    </label>
                </label>
                <div className="dropdown dropdown-top">
                    <input tabIndex={0} name="format" className="w-full input input-bordered" value={format} />
                    <div
                        tabIndex={0}
                        className="w-full dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box mb-2"
                        onChange={(e) => handlePropsChange(e, id)}
                    >
                        <label className="label cursor-pointer">
                            <span className="label-text">DATE</span>
                            <input type="radio" name="format" className="radio checked:bg-blue-500" value="date" />
                        </label>
                        <label className="label cursor-pointer">
                            <span className="label-text">TIME</span>
                            <input type="radio" name="format" className="radio checked:bg-blue-500" value="time" />
                        </label>
                        <label className="label cursor-pointer">
                            <span className="label-text">URI</span>
                            <input type="radio" name="format" className="radio checked:bg-blue-500" value="uri" />
                        </label>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
