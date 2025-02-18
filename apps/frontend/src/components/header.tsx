"use client";

import { useSiwe } from "@/context/AuthProvider";
import { useAccount } from "wagmi";

export const Account = () => {
  const { address } = useAccount();

  const { storedUsername, storedAvatar, isLoading, error, disconnect } =
    useSiwe();

  if (!address) return;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex justify-between items-center">
      <div className="flex gap-5">
        {storedAvatar ? (
          <div
            style={{
              background: storedAvatar,
              width: "80px",
              height: "80px",
              borderRadius: "50%",
            }}
          />
        ) : (
          <div
            className="bg-gray-400 animate-pulse"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
            }}
          />
        )}
        <div className="font-bold">
          {storedUsername ? (
            <div>
              {storedUsername ? `${storedUsername} (${address})` : address}
            </div>
          ) : (
            <div>No Username</div>
          )}
          <p className="text-sm font-normal text-gray-600 mb-4">{address}</p>
        </div>
      </div>

      <div>
        {address && (
          <button
            onClick={disconnect}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 active:bg-red-700 transition-colors rounded-lg shadow-md text-white font-medium"
          >
            Disconnect
          </button>
        )}
      </div>
    </div>
  );
};
