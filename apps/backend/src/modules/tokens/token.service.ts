import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { TokenEntity } from './token.entity';

export interface PaginationParams {
  limit?: number;
  cursor?: string;
}

export interface TokensResponse {
  tokens: any[];
  cursor: string | null;
  hasMore: boolean;
}

@Injectable()
export class TokensService {
  private readonly MORALIS_API_URL = 'https://deep-index.moralis.io/api/v2.2';
  private readonly MORALIS_API_KEY = process.env.MORALIS_API_KEY;

  private readonly DEFAULT_LIMIT = 100;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  constructor(
    @InjectRepository(TokenEntity)
    private tokenRepository: Repository<TokenEntity>,
  ) {}

  async getUserTokens(
    walletAddress: string,
    forceRefresh = false,
    pagination?: PaginationParams,
  ): Promise<TokensResponse> {
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      throw new BadRequestException('Invalid wallet address');
    }

    // Check if we have fresh cached data
    if (!forceRefresh) {
      const cachedTokens = await this.getCachedTokens(
        walletAddress,
        pagination,
      );
      if (cachedTokens) {
        return cachedTokens;
      }
    }

    // Fetch fresh data from Moralis
    const moralisData = await this.fetchFromMoralis(walletAddress, pagination);

    // Update database with new data
    await this.updateTokensCache(walletAddress, moralisData.tokens);

    return moralisData;
  }

  private async getCachedTokens(
    walletAddress: string,
    pagination?: PaginationParams,
  ): Promise<TokensResponse | null> {
    const cacheExpiryTime = new Date(Date.now() - this.CACHE_DURATION);

    const [tokens, total] = await this.tokenRepository.findAndCount({
      where: {
        walletAddress,
        lastUpdated: MoreThan(cacheExpiryTime),
      },
      skip: pagination?.cursor ? parseInt(pagination.cursor) : 0,
      take: pagination?.limit || this.DEFAULT_LIMIT,
      order: {
        possibleSpam: 'ASC',
      },
    });

    if (tokens.length === 0) {
      return null;
    }

    const nextCursor =
      tokens.length + (pagination?.cursor ? parseInt(pagination.cursor) : 0);

    return {
      tokens: tokens.map((token) => ({
        contractAddress: token.contractAddress,
        name: token.name,
        symbol: token.symbol,
        decimals: token.decimals,
        balance: token.balance,
        thumbnail: token.thumbnail,
        logoUrl: token.logoUrl,
        possibleSpam: token.possibleSpam,
      })),
      cursor: nextCursor < total ? nextCursor.toString() : null,
      hasMore: nextCursor < total,
    };
  }

  private async updateTokensCache(walletAddress: string, tokens: any[]) {
    const tokenEntities = tokens.map((token) => {
      const tokenEntity = new TokenEntity();
      tokenEntity.id = `${walletAddress}_${token.contractAddress}`;
      tokenEntity.walletAddress = walletAddress;
      tokenEntity.contractAddress = token.contractAddress;
      tokenEntity.name = token.name;
      tokenEntity.symbol = token.symbol;
      tokenEntity.decimals = token.decimals;
      tokenEntity.balance = token.balance;
      tokenEntity.thumbnail = token.thumbnail;
      tokenEntity.logoUrl = token.logoUrl;
      tokenEntity.possibleSpam = token.possibleSpam;
      tokenEntity.lastUpdated = new Date();
      return tokenEntity;
    });

    // Use upsert to handle both new and existing tokens
    await this.tokenRepository.upsert(tokenEntities, ['id']);
  }

  private async fetchFromMoralis(
    walletAddress: string,
    pagination?: PaginationParams,
  ): Promise<TokensResponse> {
    try {
      const response = await axios.get(
        `${this.MORALIS_API_URL}/${walletAddress}/erc20`,
        {
          params: {
            chain: 'polygon',
            limit: pagination?.limit || this.DEFAULT_LIMIT,
            cursor: pagination?.cursor || null,
          },
          headers: {
            'X-API-Key': this.MORALIS_API_KEY,
          },
        },
      );

      const tokens = response.data.map((token: any) => ({
        contractAddress: token.token_address,
        name: token.name,
        symbol: token.symbol,
        decimals: token.decimals,
        balance: token.balance,
        thumbnail: token.thumbnail || '',
        logoUrl: token.logo || '',
        possibleSpam: token.possible_spam || false,
      }));

      return {
        tokens,
        cursor: response.data.cursor || null,
        hasMore: !!response.data.cursor,
      };
    } catch (error) {
      console.error('Error fetching tokens:', error);
      throw new BadRequestException('Failed to fetch tokens');
    }
  }
}
