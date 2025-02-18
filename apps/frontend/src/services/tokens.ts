import { FetchTokensParams, TokensResponse } from "@/types/token";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const fetchTokens = async ({
  walletAddress,
  pageParam = null,
  pageSize = 10,
}: FetchTokensParams): Promise<TokensResponse> => {
  const queryParams = new URLSearchParams({
    limit: pageSize + "",
    ...(pageParam && { cursor: pageParam }),
  });

  const response = await await fetch(
    `${API_URL}/tokens/${walletAddress}?${queryParams}`
  );
  if (!response.ok) throw new Error("Failed to fetch tokens");
  return response.json();
};
