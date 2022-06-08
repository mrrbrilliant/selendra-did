import React from "react";
import { useState } from "react";
import { VscChevronUp, VscChevronDown, VscClose } from "react-icons/vsc";

export default function Collapse({ children, removeProp, title, id }) {
    const [open, setOpen] = useState(false);
    function toggle() {
        setOpen(!open);
    }
    return (
        <div
            className={
                open
                    ? "collapse collapse-open rounded-lg border border-base-300 bg-base-100"
                    : "collapse collapse-close rounded-lg border border-base-300 bg-base-100"
            }
        >
            <div className="label collapse-title p-4">
                <span className="label-text">{title === "" ? id : title}</span>
                <div className="flex flex-row space-x-2">
                    <button className="btn btn-sm btn-circle btn-ghost " onClick={toggle}>
                        {open ? <VscChevronUp size={20} /> : <VscChevronDown size={20} />}
                    </button>
                    <button className="btn btn-sm btn-circle btn-ghost text-error" onClick={() => removeProp(id)}>
                        <VscClose size={20} />
                    </button>
                </div>
            </div>
            <div className="collapse-content">{children}</div>
        </div>
    );
}
