import "../styles/globals.css";
import { useEffect, useState } from "react";
import NetworkProvider from "../contexts/network";
import WalletProvider from "../contexts/wallet";
import { ThemeProvider, useTheme } from "next-themes";
import DefaultLayout from "../components/defaultLayout";
import ContractProvider from "../contexts/contract";
import DataProvider from "../contexts/data";
import NotificationProvider from "../contexts/notification";
import Sidebar from "../components/layouts/leftBar";
import Navbar from "../components/layouts/navbar";

export function SafeHydrate({ children }) {
  const [isSSR, setIsSSR] = useState(true);
  useEffect(() => {
    setIsSSR(false);
  }, []);
  return <div suppressHydrationWarning>{!isSSR && children}</div>;
}

function MyApp({ Component, pageProps }) {
  const { theme, setTheme } = useTheme();
  const Layout = Component.Layout || DefaultLayout;
  // const Sidebar = Component.Layout || Sidebar;

  return (
    <SafeHydrate>
      <ThemeProvider
        attribute="data-theme"
        enableSystem={true}
        defaultTheme="dark"
      >
        {Component.getLayout ? (
          <NotificationProvider>
            <NetworkProvider>
              <WalletProvider>
                <ContractProvider>
                  <DataProvider>
                    <Component {...pageProps} />
                  </DataProvider>
                </ContractProvider>
              </WalletProvider>
            </NetworkProvider>
          </NotificationProvider>
        ) : (
          <NotificationProvider>
            <NetworkProvider>
              <WalletProvider>
                <ContractProvider>
                  <DataProvider>
                    <Sidebar>
                      {/* <Layout> */}
                      {/* <Navbar /> */}
                      <Component {...pageProps} />
                      {/* </Layout> */}
                    </Sidebar>
                  </DataProvider>
                </ContractProvider>
              </WalletProvider>
            </NetworkProvider>
          </NotificationProvider>
        )}
      </ThemeProvider>
    </SafeHydrate>
  );
}

export default MyApp;
