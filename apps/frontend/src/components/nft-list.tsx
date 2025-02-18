"use client";

import React, { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { fetchNFTs } from "@/services/nfts";
import SendModal from "./send-nft-modal";

const NFTList = ({ walletAddress }: { walletAddress: string }) => {
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["nfts", walletAddress, pageSize],
    queryFn: ({ pageParam }: any) =>
      fetchNFTs({
        walletAddress,
        pageParam,
        pageSize,
      }),
    getNextPageParam: (lastPage: any) => lastPage.cursor,
    enabled: !!walletAddress,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });

  const handleNFTClick = (nft: any) => {
    setSelectedNFT(nft);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (status === "error" && error instanceof Error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        {error.message}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Wallet NFTs</h2>
      <div className="mb-4 flex justify-end items-center">
        <span className="text-sm text-gray-500">NFTs per Page:</span>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="ml-2 p-2 border rounded-lg bg-black text-white"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page?.nfts.map((nft) => (
              <Card
                key={`${nft.contractAddress}-${nft.tokenId}`}
                className="overflow-hidden cursor-pointer"
                onClick={() => handleNFTClick(nft)}
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-lg truncate">{nft.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="aspect-square w-full relative mb-4">
                    <img
                      src={
                        nft.imageUrl.startsWith("ipfs://")
                          ? `https://gateway.pinata.cloud/ipfs/${nft.imageUrl.slice(
                              7
                            )}`
                          : nft.imageUrl
                      }
                      alt={nft.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://arbiscan.io/images/main/nft-placeholder.svg";
                      }}
                    />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Token ID:</span>
                      <span className="font-medium truncate">
                        {nft.tokenId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Standard:</span>
                      <span className="font-medium">{nft.tokenStandard}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </React.Fragment>
        ))}
      </div>

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="w-full p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
        >
          {isFetchingNextPage ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading more...
            </div>
          ) : (
            "Load More NFTs"
          )}
        </button>
      )}

      <SendModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedNFT={selectedNFT}
      />
    </div>
  );
};

export default NFTList;
