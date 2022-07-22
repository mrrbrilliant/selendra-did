/* eslint-disable @next/next/no-img-element */
import React, { useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { v4 as uid } from "uuid";
import { ContractContext } from "../contexts/contract";
import { NotificationContext } from "../contexts/notification";
import Badge from "../components/badge";
import lodash from "lodash";

const Profile = () => {
  const { contractPub } = useContext(ContractContext);
  const { notify } = useContext(NotificationContext);
  // user identity
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const [userAddress, setUserAddress] = useState("");
  // user info
  const [isDocLoading, setIsDocLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [detail, setDetail] = useState(null);
  const [personalInfo, setPersonalInfo] = useState(null);
  const [cType, setCType] = useState(null);
  const [typeDetail, setTypeDetail] = useState(null);
  const [images, setImages] = useState([]);
  const [orgDetail, setOrgDetail] = useState(null);

  const router = useRouter();

  const { user, typeId } = router.query;

  const toNumber = useCallback((number) => {
    const toUnit = ethers.utils.formatEther(number).toString();
    const roundedCount = Math.round(parseFloat(toUnit) * 10 ** 18);
    return roundedCount;
  }, []);

  const DocMeta = useCallback(
    (id) => {
      return contractPub._credentiallMetadata(id).then((tx, error) => {
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
    [contractPub, notify]
  );
  function orgMeta({ key }) {
    return contractPub._organizationMetadata(key).then((tx, error) => {
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

  const getDocs = useCallback(
    (address) => {
      contractPub.credentialsList(address).then((data) => {
        if (data)
          Promise.all(
            data.map(async (typeId) => {
              const row = await DocMeta(toNumber(typeId));
              return { id: toNumber(typeId), ...row };
            })
          ).then((orgs) => {
            // @ts-ignore
            setDocuments(orgs);
            setIsDocLoading(false);
          });
      });
    },
    [contractPub, DocMeta, toNumber, setDocuments, setIsDocLoading]
  );

  function ctypesMeta({ id }) {
    return contractPub._CtypeMetadata(id).then((tx, error) => {
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

  const findImage = useCallback(() => {
    if (typeDetail && personalInfo) {
      Object.entries(typeDetail.properties).forEach((entry, index) => {
        if (entry[1]["label"] && entry[1]["label"] === "Images") {
          if (personalInfo[entry[0]] && personalInfo[entry[0]].length > 0) {
            setImages([...images, ...personalInfo[entry[0]]]);
          }
        }
      });
    }
  }, [typeDetail, personalInfo, images, setImages]);

  useEffect(() => {
    if (isCheckingUser && user) {
      const valid = ethers.utils.isAddress(user);
      if (valid) {
        setUserAddress(user);
      }
      setIsCheckingUser(false);
    }
  }, [user, isCheckingUser, setIsCheckingUser, setUserAddress]);

  useEffect(() => {
    if (!isCheckingUser && userAddress && contractPub) {
      getDocs(userAddress);
    }
  }, [isCheckingUser, userAddress, getDocs, contractPub]);

  useEffect(() => {
    if (documents && documents.length === 0) return;

    if (!typeId) {
      const public_id = documents.filter((d) => d.ctypeId == 0);
      setDetail(public_id[0]);
      return;
    }

    const public_id = documents.filter((d) => d.ctypeId == typeId);
    setDetail(public_id[0]);
  }, [documents, typeId]);

  useEffect(() => {
    if (detail && detail.propertyURI) {
      fetch(detail.propertyURI)
        .then((res) => res.json())
        .then((data) => {
          setPersonalInfo(data);
        })
        .catch((error) => console.log(error));
    }
  }, [detail]);

  useEffect(() => {
    if (detail && !cType) {
      const ctypeId = toNumber(detail.ctypeId);
      ctypesMeta({ id: ctypeId }).then((data) => {
        setCType(data);
      });
    }
  }, [personalInfo, detail, ctypesMeta, setCType, toNumber, cType]);

  useEffect(() => {
    if (cType && !typeDetail) {
      fetch(cType.propertiesURI)
        .then((res) => res.json())
        .then((data) => setTypeDetail(data));
    }
  }, [cType, setTypeDetail, typeDetail]);

  useEffect(() => {
    if (cType && !orgDetail) {
      const orgId = toNumber(cType.orgId);
      orgMeta({ key: orgId }).then(async (org) => {
        const o = await org;
        setOrgDetail(o);
      });
    }
  }, [cType, toNumber, orgMeta, orgDetail, setOrgDetail]);

  useEffect(() => {
    if (typeDetail && personalInfo && images.length === 0) {
      findImage();
    }
  }, [typeDetail, personalInfo, findImage, images]);

  useEffect(() => {
    if (orgDetail) {
      console.log(orgDetail);
    }
  }, [orgDetail]);
  return (
    <div className="w-full flex place-items-start place-content-center">
      <div className="w-1/3 rounded-2xl p-4 border-gray-100 bg-base-100 relative overflow-hidden">
        <div className="flex flex-col place-items-start place-content-start">
          {images.length > 0 && (
            <div className="w-full  h-max flex place-content-center place-items-center mb-4 rounded-xl overflow-hidden relative">
              <img className="w-full h-auto" src={images[0]} alt="" layout="fixed" width={100} height={100} />
            </div>
          )}

          {images.length === 0 && typeDetail && typeDetail.images && (
            <div className="w-full h-max flex place-content-center place-items-center mb-4 rounded-xl overflow-hidden">
              <img className="w-full h-auto" src={typeDetail.images[0]} alt="" />
            </div>
          )}

          <div className="w-full flex flex-col flex-grow space-y-4">
            <div>
              <Badge status={detail?.status} />
              <h4 className="text-xl font-semibold uppercase">{detail?.name}</h4>
              <div className="font-bold text-xs text-gray-500">{orgDetail?.name}</div>
            </div>
            <textarea
              className="w-full mt-2 focus:outline-none resize-none text-xs font-mono bg-transparent"
              value={detail?.owner}
              readOnly
            />

            <div className="grid grid-cols-3 text-xs">
              {typeDetail &&
                personalInfo &&
                Object.entries(typeDetail.properties).map(
                  (e, i) =>
                    i < 3 && (
                      <React.Fragment key={e[0]}>
                        {e[1]["label"] !== "Images" && <div> {lodash.startCase(e[0])}</div>}
                        {e[1]["label"] !== "Images" && (
                          <div className="col-span-2 font-medium uppercase">{personalInfo[e[0]]}</div>
                        )}
                      </React.Fragment>
                    )
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
