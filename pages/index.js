/* eslint-disable @next/next/no-img-element */
import React, { useContext, useEffect, useCallback, useState } from "react";
import { useRouter } from "next/router";
import { VscLock } from "react-icons/vsc";
import lodash from "lodash";
import { ethers } from "ethers";
import { QRCode } from "react-qrcode-logo";

import { BalanceContext } from "../contexts/balance";
import { DataContext } from "../contexts/data";
import { WalletContext } from "../contexts/wallet";
import { ProfileContext } from "../contexts/profile";

import Badge from "../components/badge";
import BtnWithAuth from "../hooks/useAuthCallback";

const initialState = {
  name: "",
  type: "",
  docURL: "",
  docHash: "",
  ownerId: "",
};

const Home = () => {
  // contexts
  const { balance, transfer } = useContext(BalanceContext);
  const { publicKey, privateKey, wallet, checkingAuth } = useContext(WalletContext);
  const { isDocLoading, documents, isCTLoading, credentialTypes } = useContext(DataContext);
  const { profile, setProfile } = useContext(ProfileContext);
  // states

  const [isCheckingUnverifiedDocs, setIsCheckUnverifiedDocs] = useState(true);
  const [unVerifiedDocs, setUnverifiedDocs] = useState([]);
  const [setupProfile, setSetupProfile] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showReceive, setShowReceive] = useState(false);
  const [transferData, setTransferData] = useState({
    to: "",
    amount: 0,
  });
  const [validationErrors, setValidationErrors] = useState({
    to: "",
    amount: "",
  });
  const [validationChecked, setValidationChecked] = useState({
    to: false,
    amount: false,
  });

  const router = useRouter();

  // functions
  function handleTransferChange(e) {
    const { name, value } = e.target;
    setTransferData({ ...transferData, [name]: value });
    setValidationChecked({ ...validationChecked, [name]: false });
  }

  async function handleTransfer(e) {
    e.preventDefault();
    const tx = await transfer({ ...transferData });
    if (tx) {
      setTransferData({
        to: "",
        amount: 0,
      });
      setValidationChecked({
        to: false,
        amount: false,
      });
      setShowReceive(false);
      setShowTransfer(false);
    }
  }

  function toggleTransfer() {
    setShowReceive(false);
    setShowTransfer(!showTransfer);
  }

  function toggleReceive() {
    setShowTransfer(false);
    setShowReceive(!showReceive);
  }

  const toNumber = useCallback((number) => {
    const toUnit = ethers.utils.formatEther(number).toString();
    const roundedCount = Math.round(parseFloat(toUnit) * 10 ** 18);
    return roundedCount;
  }, []);

  const checkUnverifiedDocs = useCallback(async () => {
    const signer = new ethers.Wallet(wallet.privateKey);
    const signature = await signer.signMessage("decentralized_identity");

    let myHeaders = new Headers();
    myHeaders.append("Authorization", signature);
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      redirect: "follow",
      headers: myHeaders,
    };

    return fetch("https://attestation.koompi.org/claims/user", requestOptions)
      .then((response) => response.json())
      .then((result) => result)
      .catch((error) => error);
  }, [wallet]);

  const checkMasterId = useCallback(async () => {
    let hasDid = true;
    let hasRequested = true;

    // check did
    if (!checkingAuth && !isDocLoading && !isCTLoading) {
      const hasType = credentialTypes.find((t) => toNumber(t.id) === 0);

      if (!hasType) return;

      if (documents.length === 0) {
        hasDid = false;
      } else {
        const hasId = documents.filter((doc) => toNumber(doc.ctypeId) === 0);
        if (hasId.length === 0) {
          hasDid = false;
        } else {
          const uri = hasId[0]["propertyURI"];
          const data = await fetch(uri).then((res) => res.json());
          setProfile(data);
        }
      }
    }

    if (!isCheckingUnverifiedDocs) {
      if (unVerifiedDocs.length === 0) {
        hasRequested = false;
      } else {
        let hasReq = await unVerifiedDocs.filter((doc) => doc.ctypeId === 0);
        if (hasReq.length === 0) {
          hasRequested = false;
        }
      }
    }

    if (!hasDid && !hasRequested) {
      setSetupProfile(true);
    }
  }, [checkingAuth, isDocLoading, documents, toNumber, isCheckingUnverifiedDocs, unVerifiedDocs]);

  // useEffects
  const validateAmountChanged = useCallback(() => {
    if (transferData.amount !== 0 && !validationChecked.amount) {
      const validAmount = transferData.amount !== 0 && transferData.amount <= parseFloat(balance);
      setValidationChecked({ ...validationChecked, amount: true });
      if (!validAmount) {
        setValidationErrors({ ...validationErrors, amount: "Invalid amount" });
        return;
      }
      setValidationErrors({ ...validationErrors, amount: "" });
    }
  }, [transferData.amount, validationChecked, setValidationChecked, validationErrors, balance, setValidationErrors]);

  const validateAddressChanged = useCallback(() => {
    if (transferData.to !== "" && !validationChecked.to) {
      const validAddress = ethers.utils.isAddress(transferData.to);
      setValidationChecked({ ...validationChecked, to: true });
      if (!validAddress) {
        setValidationErrors({ ...validationErrors, to: "Invalid address" });
        return;
      }
      setValidationErrors({ ...validationErrors, to: "" });
    }
  }, [transferData.to, validationChecked, setValidationChecked, validationErrors, setValidationErrors]);

  useEffect(() => {
    if (!checkingAuth && wallet) {
      if (isCheckingUnverifiedDocs && wallet.privateKey) {
        checkUnverifiedDocs().then((docs) => {
          setUnverifiedDocs(docs);
          setIsCheckUnverifiedDocs(false);
        });
      }
    }
  }, [isCheckingUnverifiedDocs, checkUnverifiedDocs, wallet, checkingAuth]);

  useEffect(() => {
    checkMasterId();
  }, [checkMasterId]);

  useEffect(() => {
    if (setupProfile) {
      router.push("/organizations/docs?orgId=0&type=0");
    }
  }, [setupProfile, router]);

  useEffect(() => {
    validateAddressChanged();
  }, [validateAddressChanged]);

  useEffect(() => {
    validateAmountChanged();
  }, [validateAmountChanged]);

  return (
    <div className="md:grid md:grid-cols-3 gap-10 mt-10">
      <div className="md:col-span-1">
        <div className="bg-base-100 p-6 rounded-xl flex flex-col gap-4">
          <div className="avatar">
            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                src={
                  profile
                    ? profile?.avatar
                    : "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/412.jpg"
                }
                alt=""
              />
            </div>
          </div>

          <div>
            <p className="font-bold text-xl mb-2">{profile && profile?.full_name}</p>
            <textarea
              className="w-full mb-2 text-sm resize-none font-mono bg-transparent"
              rows={1}
              value={publicKey || ""}
              readOnly
            />
          </div>
        </div>

        <div className="stats bg-base-100 w-full mt-4">
          <div className="stat ">
            <div className="stat-title">Current balance</div>
            <div className="stat-value flex place-items-center font-mono">
              {parseFloat(balance).toLocaleString("en-US", {
                style: "currency",
                currency: "SEL",
                maximumFractionDigits: 6,
              })}
              {!privateKey && (
                <span>
                  <VscLock fontSize={32} />
                </span>
              )}
            </div>
            <div className="stat-actions flex gap-4">
              <button className="btn btn-sm btn-success">Add SEL</button>
              <button className="btn btn-sm btn-primary" onClick={toggleTransfer}>
                Transfer
              </button>
              <button className="btn btn-sm btn-secondary" onClick={toggleReceive}>
                Receive
              </button>
            </div>
            {showTransfer && (
              <form className="flex flex-col gap-4 mt-4" onSubmit={handleTransfer}>
                <div className="flex flex-col">
                  <label className="label">
                    <span className="label-text">Receiver address</span>
                    <span className="label-text-alt">0x</span>
                  </label>

                  <input
                    type="text"
                    name="to"
                    className="input input-bordered font-mono"
                    placeholder="0x0000000000000000000000000000000000000000"
                    value={transferData.to}
                    onChange={handleTransferChange}
                  />

                  {validationErrors.to !== "" && (
                    <label className="label">
                      <span className="label-text text-error">{validationErrors.to}</span>
                    </label>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="label">
                    <span className="label-text">Amount to be transfered</span>
                    <span className="label-text-alt">SEL</span>
                  </label>
                  <input
                    type="number"
                    step={0.000001}
                    min={0.000001}
                    name="amount"
                    className="input input-bordered"
                    value={transferData.amount}
                    onChange={handleTransferChange}
                  />
                  {validationErrors.amount !== "" && (
                    <label className="label">
                      <span className="label-text text-error">{validationErrors.amount}</span>
                    </label>
                  )}
                </div>
                <input
                  type="submit"
                  name="submit"
                  value="SEND"
                  className="btn btn-primary"
                  disabled={validationErrors.to !== "" || validationErrors.amount !== ""}
                />
              </form>
            )}

            {showReceive && (
              <div className="flex flex-col gap-4 mt-4 place-content-center place-items-center">
                <QRCode value={publicKey} eyeRadius={5} />
                <textarea
                  className="w-full mb-2 text-sm resize-none font-mono bg-transparent text-center"
                  rows={1}
                  value={publicKey || ""}
                  readOnly
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="md:col-span-2">
        <div>
          <div className="mb-8">
            <div>
              <h3 className="font-bold">My Documents</h3>
            </div>
            <div>
              <div className="grid grid-cols-3 mt-6 gap-6 ">
                {documents &&
                  documents.length > 0 &&
                  documents
                    .filter((res) => toNumber(res.ctypeId) != 0)
                    .map((res, index) => {
                      return <DocumentCard key={index} res={res} />;
                    })}
              </div>
              {unVerifiedDocs.length > 0 && (
                <>
                  <h1>Unverified</h1>
                  <div className="grid grid-cols-3 mt-6 gap-6 ">
                    {unVerifiedDocs &&
                      unVerifiedDocs.length > 0 &&
                      unVerifiedDocs.map((res, index) => {
                        return <DocumentCard key={index} res={res} />;
                      })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

const DocumentCard = ({ res }) => {
  const { organizations, isOrgLoading, credentialTypes, transferDocument } = useContext(DataContext);

  const [typeDetail, setTypeDetail] = useState();
  const [orgDetail, setOrgDetail] = useState();
  const [docDetail, setDocDetail] = useState();
  const [cType, setCType] = useState();

  const [transferTo, setTransferTo] = useState("");
  const [openTransfer, setOpenTransfer] = useState(false);

  const [images, setImages] = useState([]);

  const toNumber = useCallback((number) => {
    const toUnit = ethers.utils.formatEther(number).toString();
    const roundedCount = Math.round(parseFloat(toUnit) * 10 ** 18);
    return roundedCount;
  }, []);

  const getCType = useCallback(async () => {
    const id = toNumber(res.ctypeId);
    const ct = credentialTypes.filter((c) => c.id === id)[0];

    if (!ct) return;

    const orgId = toNumber(ct.orgId);

    const ctDetail = await fetch(ct.propertiesURI)
      .then((res) => res.json())
      .then((data) => data)
      .catch((error) => console.log(error));

    const doc = await fetch(res.propertyURI)
      .then((res) => res.json())
      .then((data) => data)
      .catch((error) => console.log(error));

    const org = organizations.filter((o) => toNumber(o.id) === orgId)[0];

    setTypeDetail(ctDetail);
    setOrgDetail(org);
    setDocDetail(doc);
    setCType(ct);
  }, [toNumber, credentialTypes, res, organizations, setTypeDetail, setOrgDetail, setDocDetail, setCType]);

  const findImage = useCallback(() => {
    if (typeDetail && docDetail) {
      Object.entries(typeDetail.properties).forEach((entry, index) => {
        if (entry[1]["label"] && entry[1]["label"] === "Images") {
          if (docDetail[entry[0]] && docDetail[entry[0]].length > 0) {
            setImages([...images, ...docDetail[entry[0]]]);
          }
        }
      });
    }
  }, [typeDetail, docDetail, images, setImages]);

  useEffect(() => {
    if (!cType) {
      getCType();
    }
  }, [getCType, cType]);

  useEffect(() => {
    if (typeDetail && docDetail && images.length === 0) {
      findImage();
    }
  }, [typeDetail, docDetail, findImage, images]);

  return (
    <div className=" rounded-2xl p-4 border-gray-100 bg-base-100 relative overflow-hidden">
      <div className="flex flex-col place-items-start place-content-start">
        {images.length > 0 && (
          <div className="w-full  h-max flex place-content-center place-items-center mb-4 rounded-xl overflow-hidden relative">
            <img className="w-full max-h-64" src={images[0]} alt="" layout="fixed" width={100} height={100} />
          </div>
        )}

        {images.length === 0 && typeDetail && typeDetail.images && (
          <div className="w-full  h-max flex place-content-center place-items-center mb-4">
            <img className="w-auto max-h-64" src={typeDetail.images[0]} alt="" />
          </div>
        )}
        {toNumber(res.ctypeId)}
        <div className="w-full flex flex-col flex-grow space-y-4">
          <div>
            <Badge status={res.status} />
            <h4 className="text-xl font-semibold uppercase">{res.name}</h4>
            <div className="font-bold text-xs text-gray-500">{orgDetail?.name}</div>
          </div>
          <textarea
            className="w-full mt-2 focus:outline-none resize-none text-xs font-mono bg-transparent"
            value={res.propertyHash}
            readOnly
          />

          <div className="grid grid-cols-3 text-xs">
            {typeDetail &&
              docDetail &&
              Object.entries(typeDetail.properties).map(
                (e, i) =>
                  i < 3 && (
                    <React.Fragment key={e[0]}>
                      {e[1]["label"] !== "Images" && <div> {lodash.startCase(e[0])}</div>}
                      {e[1]["label"] !== "Images" && (
                        <div className="col-span-2 font-medium uppercase">{docDetail[e[0]]}</div>
                      )}
                    </React.Fragment>
                  )
              )}
          </div>

          {openTransfer && (
            <>
              <textarea
                className="w-full textarea textarea-error mt-2 focus:outline-none resize-none"
                placeholder="Transfer to"
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
              />
              <div className="flex space-x-2">
                <button
                  className="p-2 text-white w-32 leading-none rounded font-bold mt-2 bg-primarypink hover:bg-opacity-75 text-xs uppercase"
                  onClick={(e) => {
                    setTransferTo("");
                    setOpenTransfer(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="p-2 text-white w-32 leading-none rounded font-bold mt-2 bg-primarypink hover:bg-opacity-75 text-xs uppercase"
                  onClick={() => {
                    transferDocument({ credentialid: res.id, to: transferTo });
                    setTransferTo("");
                    setOpenTransfer(false);
                  }}
                >
                  Confirm
                </button>
              </div>
            </>
          )}
          {!openTransfer && (
            <div className="flex space-x-2">
              {typeDetail && Object.entries(typeDetail.properties).length > 3 && (
                <button className="p-2 flex-grow btn btn-secondary btn-sm text-xs uppercase">Detail</button>
              )}

              {cType && cType.transferable && (
                <BtnWithAuth
                  className="p-2 flex-grow text-white w-32 leading-none rounded font-bold mt-2 bg-primarypink hover:bg-opacity-75 text-xs uppercase"
                  callback={() => {
                    setOpenTransfer(true);
                  }}
                >
                  Transfer
                </BtnWithAuth>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
