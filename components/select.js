import React from "react";
import { VscChevronDown } from "react-icons/vsc";
import { v4 as uid } from "uuid";

export default function Select({ data, selected, setSelected, name }) {
    return (
        <div className="dropdown w-full">
            <label tabIndex={0} className="input-group input m-0 p-0">
                <input
                    name="format"
                    type="text"
                    placeholder="Type"
                    className="input w-full flex-grow"
                    value={selected.label}
                    readOnly={true}
                />
                <span className="bg-transparent">
                    <VscChevronDown />
                </span>
            </label>
            <div tabIndex={0} className="w-full dropdown-content menu p-0 shadow-lg bg-base-100 rounded-box mb-2">
                {data.map((opt) => (
                    <label key={uid()} className="label cursor-pointer hover:bg-blue-300 p-2 transition-all">
                        <span className="label-text">{opt.label}</span>
                        <input
                            type="radio"
                            name={name}
                            className="radio checked:bg-blue-500"
                            checked={selected.value === opt.value}
                            value={opt.value}
                            onChange={(e) => setSelected(e, opt)}
                        />
                    </label>
                ))}
            </div>
        </div>
    );
}
