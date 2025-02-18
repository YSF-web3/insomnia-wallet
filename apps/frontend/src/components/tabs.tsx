"use client";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import TokenList from "./token-list";
import NFTList from "./nft-list";

function WalletTabs() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState("tokens");

  const tabs = [
    { id: "tokens", label: "Tokens" },
    { id: "nfts", label: "NFTs" },
    { id: "transactions", label: "Transactions" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "tokens":
        return <TokenList walletAddress={address as string} />;
      case "nfts":
        return (
          <NFTList
            walletAddress={"0xff3879b8a363aed92a6eaba8f61f1a96a9ec3c1e"}
          />
        );
      case "transactions":
        return (
          <div className="p-4 text-center">
            <h3 className="text-lg font-medium">Transactions</h3>
            <p className="text-gray-500">
              Your transaction history will appear here
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === tab.id
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">{renderTabContent()}</div>
    </div>
  );
}

export default WalletTabs;
