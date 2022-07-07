import React, { createContext, useState, useEffect } from "react";
import { create } from "ipfs-http-client";

const IpfsContext = createContext();

const IpfsProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [error, setError] = useState(null);

  const connect = async () => {
    try {
      const http = create("/ip4/127.0.0.1/tcp/5001");
      const isOnline = await http.isOnline();

      if (isOnline) {
        setClient(http);
        setError(null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    connect();
  }, []);

  return <IpfsContext.Provider value={client}>{children}</IpfsContext.Provider>;
};

export { IpfsContext };
export default IpfsProvider;
