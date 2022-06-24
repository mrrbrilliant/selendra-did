import React from "react";
import Gun from "gun";

const GUN_ADDR = process.env.NEXT_PUBLIC_GUN_ADDR || "";
const GunContext = React.createContext();
const initialGun = Gun(GUN_ADDR);

const GunProvider = ({ children }) => {
  const [gun, setGun] = React.useState(initialGun);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window["gun"] = gun;
    }
  }, []);

  return <GunContext.Provider value={gun}>{children}</GunContext.Provider>;
};

export { GunContext };
export default GunProvider;
