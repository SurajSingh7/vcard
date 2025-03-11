"use client";

import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "../store/store";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import AppInitializer from "@/helper/AppInitializer";
import GlobalEventListener from "@/components/common/GlobalEventListener";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/manifest.json"/>
        <link rel="icon" href="/icons/icon-192.png" />
        <title>V Card</title>
      </head>

      <body>
        <Provider store={store}>
          <GlobalEventListener />
          <Toaster />
          <AppInitializer />
          <Navbar />
          <main>{children}</main>
          {/* <Footer /> */}
        </Provider>
      </body>
    </html>
  );
}



