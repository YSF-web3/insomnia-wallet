"use client";
// context/SiweProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useAccount, useEnsName, useEnsAvatar, useDisconnect } from "wagmi";
import { whoami } from "@/services/auth";
import { generateRandomGradient } from "@/lib/utils";

// Context and Provider for SIWE session
const SiweContext = createContext<any>(null);

export const SiweProvider = ({ children }: { children: React.ReactNode }) => {
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [storedAvatar, setStoredAvatar] = useState<string | null>(null);

  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setJwtToken(storedToken);
    }

    if (address) {
      const savedAvatar = localStorage.getItem("avatar");
      if (savedAvatar) {
        setStoredAvatar(savedAvatar);
      } else {
        const generatedAvatar = generateRandomGradient();
        localStorage.setItem("avatar", generatedAvatar);
        setStoredAvatar(generatedAvatar);
      }
    }
  }, [address]);

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: whoami,
    enabled: false,
  });
  const { disconnect } = useDisconnect();

  // Store username from the user object
  const [storedUsername, setStoredUsername] = useState<string | null>(null);

  // Update the stored username when the user object is updated
  useEffect(() => {
    console.log(user);

    if (user?.data.username) {
      setStoredUsername(user.data.username);
    }
  }, [user]); // Depend on `user` to make it reactive

  return (
    <SiweContext.Provider
      value={{
        jwtToken,
        setJwtToken,
        user,
        isLoading,
        error,
        storedUsername,
        disconnect,
        storedAvatar,
        generateRandomGradient,
      }}
    >
      {children}
    </SiweContext.Provider>
  );
};

// Custom hook to access the SIWE context
export const useSiwe = () => {
  const context = useContext(SiweContext);
  if (!context) {
    throw new Error("useSiwe must be used within a SiweProvider");
  }
  return context;
};
