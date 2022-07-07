import "../styles/globals.css";
import { useEffect, useState } from "react";
import NetworkProvider from "../contexts/network";
import WalletProvider from "../contexts/wallet";
import { ThemeProvider, useTheme } from "next-themes";
// import DefaultLayout from "../examples/defaultLayout";
// import Navbar from "../components/layouts/navbar";
import ContractProvider from "../contexts/contract";
import DataProvider from "../contexts/data";
import NotificationProvider from "../contexts/notification";
import Sidebar from "../components/layouts/leftBar";
import NotificationManager from "../components/notifications/manager";
import UnlockWallet from "../components/wallet";

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
              <ContractProvider>
                <DataProvider>
                  <Sidebar>
                    <NotificationManager />
                    <UnlockWallet />
                    <Component {...pageProps} />
                  </Sidebar>
                </DataProvider>
              </ContractProvider>
            </WalletProvider>
          </NetworkProvider>
        </NotificationProvider>
      </ThemeProvider>
    </SafeHydrate>
  );
}

export default MyApp;
