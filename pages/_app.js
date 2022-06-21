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

export function SafeHydrate({ children }) {
  const [isSSR, setIsSSR] = useState(true);
  useEffect(() => {
    setIsSSR(false);
  }, []);
  return <div suppressHydrationWarning>{!isSSR && children}</div>;
}

function MyApp({ Component, pageProps }) {
  const { theme, setTheme } = useTheme();
  // const Layout = Component.Layout || DefaultLayout;

  return (
    <SafeHydrate>
      <ThemeProvider
        attribute="data-theme"
        enableSystem={true}
        defaultTheme="dark"
      >
        {/* <Sidebar> */}
        <NotificationProvider>
          <NetworkProvider>
            <WalletProvider>
              <ContractProvider>
                <DataProvider>
                  {/* <Layout> */}
                  <Component {...pageProps} />
                  {/* </Layout> */}
                </DataProvider>
              </ContractProvider>
            </WalletProvider>
          </NetworkProvider>
        </NotificationProvider>
        {/* </Sidebar> */}
      </ThemeProvider>
    </SafeHydrate>
  );
}

export default MyApp;
