import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ContractContext } from "./contract";
import { WalletContext } from "./wallet";
import { NotificationContext } from "./notification";
import { ethers } from "ethers";
import { v4 as uid } from "uuid";

// @ts-ignore
export const DataContext = createContext();
DataContext.displayName = "DataContext";

export default function DataProvider({ children }) {
    const { plainWallet, checkingAuth } = useContext(WalletContext);
    const { contract } = useContext(ContractContext);
    const { notify, hide } = useContext(NotificationContext);
    // Organizations
    const [isOrgLoading, setIsOrgLoading] = useState(true);
    const [organizations, setOrganizations] = useState([]);
    // CredentialTypes
    const [isCTLoading, setIsCTLoading] = useState(true);
    const [credentialTypes, setCredentialTypes] = useState([]);
    // Documents
    const [isDocLoading, setIsDocLoading] = useState(true);
    const [documents, setDocuments] = useState([]);

    // =============================================================
    // ======================== ORGANIZATION =======================
    // =============================================================
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchOrgzations = () => {
        organizationListsByUser().then((data) => {
            if (data)
                Promise.all(
                    data.map(async (org) => {
                        const row = await orgMeta({ key: toNumber(org) });
                        return { id: toNumber(org), ...row };
                    })
                ).then((orgs) => {
                    setOrganizations(orgs);
                    setIsOrgLoading(false);
                });
        });
    };

    const refetchOrgzations = async () => {
        // setIsOrgLoading(true);
        await fetchOrgzations();
    };
    function toNumber(number) {
        const toUnit = ethers.utils.formatEther(number).toString();
        const roundedCount = Math.round(parseFloat(toUnit) * 10 ** 18);
        return roundedCount;
    }

    async function countOrgByUser() {
        const count = await contract.organizationOf(plainWallet.address);
        const number = toNumber(count);
        return number;
    }

    async function organizationLists() {
        try {
            const list = await contract.organizationLists();
            const ids = list.map((id) => toNumber(id));
        } catch (error) {
            if (error) {
                console.log(error);
            }
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function organizationListsByUser() {
        try {
            const list = await contract.organizationListsByUser(plainWallet.address);
            const ids = list.map((id) => toNumber(id));
            return ids;
        } catch (error) {
            if (error) {
                console.log(error);
            }
        }
    }

    function createOrg({ name, description, orgUri }) {
        const id = uid();
        notify({ id, status: "loading", name: "Create organization", message: `Creating ${name}.` });
        contract.createOrg(name, description, orgUri).then(async (tx, error) => {
            if (error) {
                console.log(error);
            }

            await tx.wait();
            hide(id);
            const id2 = uid();
            notify({
                id: id2,
                status: "success",
                name: "Congratulation",
                message: `${name.toUpperCase()} is now on Selendra blockchain!`,
            });
            refetchOrgzations();
        });
    }

    function orgMeta({ key }) {
        return contract._organizationMetadata(key).then((tx, error) => {
            if (error) {
                const id = uid();
                notify({
                    id,
                    status: "error",
                    name: "Error",
                    message: `Failed to remove orgaization.\n${error.toString()}`,
                });
                return;
            }
            return tx;
        });
    }
    async function deleteOrg(key) {
        const id = uid();
        notify({
            id,
            status: "loading",
            name: "Delete organization",
            message: `Selected organization is being removed.`,
        });
        contract
            .deleteOrg(key)
            .then(async (tx, error) => {
                if (error) {
                    const id = uid();
                    notify({
                        id,
                        status: "error",
                        name: "Error",
                        message: `Failed to remove orgaization.\n${error.toString()}`,
                    });
                    return;
                }
                await tx.wait();
                hide(id);
                const id2 = uid();
                notify({
                    id: id2,
                    status: "success",
                    name: "Removed",
                    message: `Organizatio has been removed Selendra blockchain!`,
                });
                refetchOrgzations();
            })
            .catch((error) => {
                if (error) {
                    const id = uid();
                    notify({
                        id,
                        status: "error",
                        name: "Error",
                        message: `Failed to remove orgaization.\n${error.toString()}`,
                    });
                }
            });
    }
    // =======================================================
    // ======================== CTYPES =======================
    // =======================================================

    useEffect(() => {
        if (!checkingAuth) {
            async function loadAll() {
                fetchOrgzations();
            }

            loadAll();
        }
    }, [organizationListsByUser, fetchOrgzations, plainWallet, checkingAuth]);

    const value = {
        isOrgLoading,
        organizations,
        setOrganizations,
        refetchOrgzations,
        organizationLists,
        countOrgByUser,
        createOrg,
        deleteOrg,
        orgMeta,
        organizationListsByUser,
    };
    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
