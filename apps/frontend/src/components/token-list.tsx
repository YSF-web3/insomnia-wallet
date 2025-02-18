"use client";

import React, { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import {
  Token,
  TokensResponse,
  TokenListProps,
  FetchTokensParams,
} from "@/types/token";
import { fetchTokens } from "@/services/tokens";

const TokenList: React.FC<TokenListProps> = ({ walletAddress }) => {
  const [pageSize, setPageSize] = useState(10);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["tokens", walletAddress, pageSize],
    queryFn: ({ pageParam }) =>
      fetchTokens({
        walletAddress,
        pageParam,
        pageSize,
      }),
    getNextPageParam: (lastPage) => lastPage.cursor,
    enabled: !!walletAddress,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });

  const formatBalance = (balance: string, decimals: number): string => {
    return (parseFloat(balance) / Math.pow(10, decimals)).toFixed(4);
  };

  if (status === "loading") {
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
      <h2 className="text-2xl font-bold mb-4">Wallet Tokens</h2>

      {/* Pagination Selector */}
      <div className="mb-4 flex justify-end items-center">
        <span className="text-sm text-gray-500">Tokens per page:</span>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="ml-2 p-2 border rounded-lg bg-black "
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>

      <div className="space-y-4">
        {data?.pages.map((page: any, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.tokens.map((token: Token) => (
              <Card key={token.contractAddress} className="overflow-hidden">
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center gap-2">
                    {token.logoUrl && (
                      <img
                        src={token.logoUrl}
                        alt={token.symbol}
                        className="w-8 h-8 rounded-full"
                        onError={(
                          e: React.SyntheticEvent<HTMLImageElement>
                        ) => {
                          e.currentTarget.src = "/api/placeholder/32/32";
                        }}
                      />
                    )}
                    <span>{token.name}</span>
                    <span className="text-sm text-gray-500">
                      ({token.symbol})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Balance:</span>
                    <span className="font-medium">
                      {formatBalance(token.balance, token.decimals)}
                    </span>
                  </div>
                  {token.possibleSpam && (
                    <div className="mt-2 text-sm text-yellow-600  p-2 rounded">
                      ⚠️ Possible spam token
                    </div>
                  )}
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
            "Load More Tokens"
          )}
        </button>
      )}
    </div>
  );
};

export default TokenList;
