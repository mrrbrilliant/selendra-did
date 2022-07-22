// @ts-ignore
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ContractContext } from "./contract";
import { WalletContext } from "./wallet";
import { NotificationContext } from "./notification";
import { ethers } from "ethers";
import { v4 as uid } from "uuid";
import { NetworkContext } from "./network";

// @ts-ignore
export const DataContext = createContext();
DataContext.displayName = "DataContext";

export default function DataProvider({ children }) {
  const { wallet, checkingAuth, unlockWallet, requestUnlock, publicKey, setCb, toggleRequest } =
    useContext(WalletContext);
  const { contractRO, contractRW } = useContext(ContractContext);
  const { notify, hide } = useContext(NotificationContext);
  // Organizations
  const [isOrgLoading, setIsOrgLoading] = useState(true);
  const [organizations, setOrganizations] = useState([]);
  const [isOwnOrgLoading, setIsOwnOrgLoading] = useState(true);
  const [ownOrganizations, setOwnOrganizations] = useState([]);
  // CredentialTypes
  const [isCTLoading, setIsCTLoading] = useState(true);
  const [credentialTypes, setCredentialTypes] = useState([]);
  // Documents
  const [isDocLoading, setIsDocLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const network = useContext(NetworkContext);
  const [initialBlock, setInitialBlock] = useState(null);

  // =============================================================
  // ======================== ORGANIZATION =======================
  // =============================================================
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchOrgzations = () => {
    if (isOrgLoading) {
      organizationLists().then((data) => {
        if (data)
          Promise.all(
            data.map(async (org) => {
              const row = await orgMeta({ key: toNumber(org) });
              return { id: toNumber(org), ...row };
            })
          ).then((orgs) => {
            // @ts-ignore
            setOrganizations(orgs);
            setIsOrgLoading(false);
          });
      });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchOwnOrgzations = () => {
    if (isOwnOrgLoading) {
      organizationListsByUser().then((data) => {
        if (data)
          Promise.all(
            data.map(async (org) => {
              const row = await orgMeta({ key: toNumber(org) });
              return { id: toNumber(org), ...row };
            })
          ).then((orgs) => {
            // @ts-ignore
            setOwnOrganizations(orgs);
            setIsOwnOrgLoading(false);
          });
      });
    }
  };

  const refetchOrgzations = async () => {
    setIsOrgLoading(true);
    await fetchOrgzations();
  };

  const refetchOwnOrgzations = async () => {
    setIsOwnOrgLoading(true);
    await fetchOwnOrgzations();
  };

  const toNumber = (number) => {
    const toUnit = ethers.utils.formatEther(number).toString();
    const roundedCount = Math.round(parseFloat(toUnit) * 10 ** 18);
    return roundedCount;
  };

  async function countOrgByUser() {
    const count = await contractRO.organizationOf(publicKey);
    const number = toNumber(count);
    return number;
  }

  async function ownerOfOrg(orgId) {
    return await contractRO.ownerOf(orgId);
  }

  const organizationLists = async () => {
    try {
      const list = await contractRO.organizationLists();
      const ids = list.map((id) => toNumber(id));
      return ids;
    } catch (error) {
      if (error) {
        console.log(error);
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function organizationListsByUser() {
    try {
      const list = await contractRO.organizationListsByUser(publicKey);
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
    contractRW.createOrg(name, description, orgUri).then(async (tx, error) => {
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
      refetchOwnOrgzations();
    });
  }

  function orgMeta({ key }) {
    return contractRO._organizationMetadata(key).then((tx, error) => {
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
    let id = uid();
    let status = "loading";
    let name = "Delete organization";
    let message = `Selected organization is being removed.`;
    notify({ id, status, name, message });

    contractRW
      .deleteOrg(key)
      .then(async (tx, error) => {
        if (error) {
          let id = uid();
          let status = "error";
          let name = "Error";
          let message = `Failed to remove orgaization.\n${error.toString()}`;
          return notify({ id, status, name, message });
        }
        await tx.wait();
        let id2 = uid();
        let status = "success";
        let name = "Removed";
        let message = `Organizatio has been removed Selendra blockchain!`;
        notify({ id: id2, status, name, message });
        refetchOrgzations();
        refetchOwnOrgzations();
        hide(id);
      })
      .catch((error) => {
        const id = uid();
        let status = "error";
        let name = "Error";
        let message = `Failed to remove orgaization.\n${error.toString()}`;
        notify({ id, status, name, message });
      });
  }
  // =======================================================
  // ======================== CTYPES =======================
  // =======================================================
  // uint256 organizationId,
  // string memory propertiesURI,
  // string memory propertiesHash,
  // bool transferable,
  // bool revokable,
  // bool expirable,
  // uint256 lifespan
  function ctypesMeta({ id }) {
    return contractRO._CtypeMetadata(id).then((tx, error) => {
      if (error) {
        const id = uid();
        notify({
          id,
          status: "error",
          name: "Error",
          message: `Failed to fetch CType.\n${error.toString()}`,
        });
        return;
      }
      return tx;
    });
  }

  const unique = (value, index, self) => {
    return self.indexOf(value) === index;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function fetchCtypes() {
    // if (!isCTLoading) [];
    if (organizations.length > 0) {
      Promise.all(
        organizations.map(async (org) => {
          // @ts-ignore
          const type = await fetchCtypesByOrg({ orgId: org.id });
          if (type) {
            // @ts-ignore
            setCredentialTypes((prev) => {
              const data = [...prev, ...type];
              const uniqeCtypes = data
                .map((d) => JSON.stringify(d))
                .filter(unique)
                .map((a) => JSON.parse(a));
              console.log(uniqeCtypes);
              return [...uniqeCtypes];
            });
          }
          return type;
        })
        // @ts-ignore
      ).then((ct) => {
        // setCredentialTypes(ct);
        setIsCTLoading(false);
      });
    }
  }

  async function refetchCtypes() {
    setIsCTLoading(true);
    await fetchCtypes();
  }

  function fetchCtypesByOrg({ orgId }) {
    return contractRO.ctypeLists(orgId).then(async (data) => {
      const ctypes = await Promise.all(
        data.map(async (org) => {
          const row = await ctypesMeta({ id: toNumber(org) });
          return { id: toNumber(org), ...row };
        })
      );
      return ctypes.filter((x) => x.status === 1);
    });
  }

  async function deleteCtype({ organizationId, ctypeId }) {
    const id_loading = uid();
    const id_error = uid();
    const id_success = uid();
    notify({
      id: id_loading,
      status: "loading",
      name: "Delete credential type",
      message: `Selected credential type is being removed.`,
    });
    await contractRW
      .deleteCtype(organizationId, ctypeId)
      .then(async (tx, error) => {
        if (error) {
          notify({
            id: id_error,
            status: "error",
            name: "Error",
            message: `Failed to delete CType.\n${error.toString()}`,
          });
          return;
        }

        await tx.wait();
        notify({
          id: id_success,
          status: "success",
          name: "Removed",
          message: `Credential type has been removed Selendra blockchain!`,
        });
        hide(id_loading);
        setCredentialTypes((prev) => prev.filter((x) => x.id !== ctypeId));
      })
      .catch((error) => console.log(error));
  }
  // uint256 organizationId,
  // string memory propertiesURI,
  // string memory propertiesHash,
  // bool transferable,
  // bool revokable,
  // bool expirable,
  // uint256 lifespan
  function createCtype({
    organizationId,
    propertiesURI,
    propertiesHash,
    transferable,
    revokable,
    expirable,
    lifespan,
  }) {
    const id = uid();
    notify({ id, status: "loading", name: "Create credential type", message: `Creating a new credential type` });
    try {
      if (!contractRW) throw new Error("contract required");
      contractRW
        .createCtype(
          parseInt(organizationId),
          propertiesURI,
          propertiesHash,
          transferable,
          revokable,
          expirable,
          parseInt(lifespan)
        )
        .then(async (tx, error) => {
          if (error) {
            const id = uid();
            notify({ id, status: "error", name: "Error", message: `Failed to create CType.\n${error.toString()}` });
            return;
          }
          await tx.wait();
          hide(id);
          const id2 = uid();
          notify({
            id: id2,
            status: "success",
            name: "Created",
            message: `Credential type has been registerd on Selendra blockchain!`,
          });
          refetchCtypes();
        })
        .catch((error) => console.log(error));
    } catch (error) {
      throw error;
    }
  }

  async function usersByCTypes(id) {
    const docs = await contractRO.usersByCTypes(id);
    const all_docs = await Promise.all(
      docs.map(async (d) => {
        const data = await DocMeta(toNumber(d));

        return { id: toNumber(d), ...data };
      })
    ).then((data) => data);
    return all_docs;
  }
  // Documents
  // uint256 ctypeId,
  // address to,
  // string name,
  // string propertyURI,
  // string propertyHash
  function createDocument({ ctypeId, to, name, propertyURI, propertyHash }) {
    const id = uid();
    notify({ id, status: "loading", name: `Create ${name}`, message: `Creating a new document` });

    contractRW.issueCredential(parseInt(ctypeId), to, name, propertyURI, propertyHash).then((tx, error) => {
      if (error) {
        const id = uid();
        notify({
          id,
          status: "error",
          name: "Error",
          message: `Failed to create ${name}.\n${error.toString()}`,
        });
        return;
      }
      tx.wait();
      hide(id);
      const id2 = uid();
      notify({
        id: id2,
        status: "success",
        name: "Completed",
        message: `New ${name} is created.`,
      });
    });
  }
  // @ts-ignore
  function transferDocument({ credentialid, to }) {
    const id = uid();
    notify({ id, status: "loading", name: `Transfering`, message: `Transfering document to ${to}` });

    contractRW.transfer(credentialid, to).then((tx, error) => {
      if (error) {
        const _id = uid();
        notify({
          id: _id,
          status: "error",
          name: "Error",
          message: `Failed to transfer document.\n${error.toString()}`,
        });
        hide(id);
        return;
      }
      tx.wait();
      hide(id);
      const id2 = uid();
      notify({
        id: id2,
        status: "success",
        name: "Completed",
        message: `Document transfered.`,
      });
      getMyDocs(publicKey);
    });
  }
  // uint256 credentialid
  // @ts-ignore
  function toggleRevokeDocument({ credentialid, revoke }) {
    const id = uid();
    notify({ id, status: "loading", name: `Transfering`, message: `Revoking document` });
    contractRW.toggleRevokeCredential(credentialid, revoke).then(async (tx, error) => {
      if (error) {
        const _id = uid();
        notify({
          id: _id,
          status: "error",
          name: "Error",
          message: `Failed to revoke document.\n${error.toString()}`,
        });
        hide(id);
        return;
      }
      await tx.wait();
      hide(id);
      const id2 = uid();
      notify({
        id: id2,
        status: "success",
        name: "Completed",
        message: `Document revoked.`,
      });
    });
  }

  const DocMeta = useCallback(
    (id) => {
      return contractRO._credentiallMetadata(id).then((tx, error) => {
        if (error) {
          const id = uid();
          notify({
            id,
            status: "error",
            name: "Error",
            message: `Failed to fetch document.\n${error.toString()}`,
          });
          return;
        }

        return tx;
      });
    },
    [contractRO, notify]
  );

  const getMyDocs = useCallback(
    (address) => {
      contractRO.credentialsList(address).then((data) => {
        if (data)
          Promise.all(
            data.map(async (docId) => {
              const row = await DocMeta(toNumber(docId));
              return { id: toNumber(docId), ...row };
            })
          ).then((orgs) => {
            // @ts-ignore
            setDocuments(orgs);
            setIsDocLoading(false);
          });
      });
    },
    [contractRO, DocMeta, toNumber, setDocuments, setIsDocLoading]
  );

  const transferEvent = useCallback(() => {
    contractRO &&
      initialBlock &&
      contractRO.on("TransferCredential", (to, credentialid, event) => {
        if (to === publicKey && event.blockNumber > initialBlock) {
          setInitialBlock(event.blockNumber);
          const id = uid();
          notify({ id, status: "success", name: `Received`, message: `New document received.` });
          getMyDocs(publicKey);
        }
      });
  }, [contractRO, publicKey, initialBlock, notify, getMyDocs]);

  useEffect(() => {
    if (network && !initialBlock) {
      network.getBlockNumber().then((number) => setInitialBlock(number));
    }
  }, [network, initialBlock, setInitialBlock]);

  useEffect(() => {
    if (contractRO && publicKey && initialBlock) {
      transferEvent();
    }
  }, [transferEvent, contractRO, publicKey, initialBlock]);

  useEffect(() => {
    if (!checkingAuth && publicKey && contractRO && !isOrgLoading && isCTLoading) {
      fetchCtypes().then(() => console.log("refected"));
    }
  }, [checkingAuth, isCTLoading, isOrgLoading, fetchCtypes, contractRO, publicKey]);

  useEffect(() => {
    if (!checkingAuth && publicKey && contractRO) {
      async function loadAll() {
        fetchOrgzations();
      }

      loadAll();
    }
  }, [organizationLists, fetchOrgzations, checkingAuth, publicKey, contractRO]);

  useEffect(() => {
    if (!checkingAuth && publicKey && contractRO) {
      async function loadAll() {
        fetchOwnOrgzations();
        console.log("i ran");
      }

      loadAll();
    }
  }, [organizationListsByUser, fetchOwnOrgzations, checkingAuth, getMyDocs, publicKey, contractRO]);

  useEffect(() => {
    if (!checkingAuth && publicKey && contractRO) {
      if (isDocLoading) {
        async function loadAll() {
          getMyDocs(publicKey);
        }

        loadAll();
      }
    }
  }, [checkingAuth, getMyDocs, publicKey, contractRO, isDocLoading]);

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
    ownOrganizations,
    isOwnOrgLoading,
    fetchOwnOrgzations,
    refetchOwnOrgzations,
    ownerOfOrg,
    // ctypes
    isCTLoading,
    credentialTypes,
    fetchCtypes,
    refetchCtypes,
    createCtype,
    deleteCtype,
    usersByCTypes,
    // docs
    isDocLoading,
    documents,
    createDocument,
    transferDocument,
    toggleRevokeDocument,
  };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
