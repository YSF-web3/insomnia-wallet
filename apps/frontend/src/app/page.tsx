"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { config } from "@/config/wagmi";

import { WagmiProvider } from "wagmi";
import WalletLogin from "@/components/wallet-login";
import { SiweProvider } from "@/context/AuthProvider";
import Tabs from "@/components/tabs";
import { Toaster } from "react-hot-toast";
import { Account } from "@/components/header";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function Home() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <SiweProvider>
          <div className=" flex flex-col">
            <WalletLogin />
            <Account />
          </div>
          <Tabs />
          <Toaster position="top-center" />
        </SiweProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
