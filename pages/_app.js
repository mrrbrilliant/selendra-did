import "../styles/globals.css";
import { useEffect, useState } from "react";
import NetworkProvider from "../contexts/network";
import WalletProvider from "../contexts/wallet";
import { ThemeProvider, useTheme } from "next-themes";

import ContractProvider from "../contexts/contract";
import DataProvider from "../contexts/data";
import NotificationProvider from "../contexts/notification";
import Layout from "../components/layout";
import NotificationManager from "../components/notifications/manager";
import UnlockWallet from "../components/wallet";
import BalanceProvider from "../contexts/balance";
import ProfileProvider from "../contexts/profile";

export function SafeHydrate({ children }) {
  const [isSSR, setIsSSR] = useState(true);
  useEffect(() => {
    setIsSSR(false);
  }, []);
  return <div suppressHydrationWarning>{!isSSR && children}</div>;
}

function MyApp({ Component, pageProps }) {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const t = window.localStorage.getItem("theme") || "";
    if (!t) {
      window.localStorage.setItem("theme", "light");
      setTheme("light");
      return;
    }
    setTheme(t);
  }, [setTheme]);

  return (
    <SafeHydrate>
      <ThemeProvider attribute="data-theme" defaultTheme={"light"}>
        <NotificationProvider>
          <NetworkProvider>
            <WalletProvider>
              <ProfileProvider>
                <ContractProvider>
                  <BalanceProvider>
                    <DataProvider>
                      <Layout>
                        <NotificationManager />
                        <UnlockWallet />
                        <Component {...pageProps} />
                      </Layout>
                    </DataProvider>
                  </BalanceProvider>
                </ContractProvider>
              </ProfileProvider>
            </WalletProvider>
          </NetworkProvider>
        </NotificationProvider>
      </ThemeProvider>
    </SafeHydrate>
  );
}

export default MyApp;
