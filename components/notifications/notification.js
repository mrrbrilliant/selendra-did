import React, { useEffect } from "react";
import { VscClose, VscError, VscCheckAll } from "react-icons/vsc";
export default function Notificatoin({ data, hide }) {
    const { id, name, message, status } = data;

    useEffect(() => {
        if (status !== "loading") {
            setTimeout(() => {
                hide(id);
            }, 3000);
        }
    }, []);

    if (status.toLowerCase() === "error") {
        return <Error id={id} name={name} message={message} hide={hide} />;
    }

    if (status.toLowerCase() === "success") {
        return <Success id={id} name={name} message={message} hide={hide} />;
    }

    return <Loading id={id} name={name} message={message} hide={hide} />;
}

function Error({ id, name, message, hide }) {
    return (
        <div className="w-full alert alert-error shadow-lg text-error-content">
            <div>
                <VscError />
                <div>
                    <h3 className="font-bold">{name}</h3>
                    <div className="text-xs">{message}</div>
                </div>
            </div>
            <div className="flex-none">
                <button className="btn btn-sm btn-ghost" onClick={() => hide(id)}>
                    <VscClose />
                </button>
            </div>
        </div>
    );
}

function Loading({ id, name, message, hide }) {
    return (
        <div className="w-full alert shadow-lg">
            <div>
                <button className="btn btn-ghost btn-square loading"></button>
                <div>
                    <h3 className="font-bold">{name}</h3>
                    <div className="text-xs">{message}</div>
                </div>
            </div>
            <div className="flex-none"></div>
        </div>
    );
}

function Success({ id, name, message, hide }) {
    return (
        <div className="w-full alert alert-success shadow-lg text-success-content">
            <div>
                <VscCheckAll />
                <div>
                    <h3 className="font-bold">{name}</h3>
                    <div className="text-xs">{message}</div>
                </div>
            </div>
            <div className="flex-none">
                <button className="btn btn-sm btn-ghost" onClick={() => hide(id)}>
                    <VscClose />
                </button>
            </div>
        </div>
    );
}
