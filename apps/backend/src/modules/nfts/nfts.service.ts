// nft.entity.ts

// nfts.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { NFTEntity } from './nft.entity';
import axios from 'axios';

export interface PaginationParams {
  limit?: number;
  cursor?: string;
}

export interface NFTsResponse {
  nfts: any[];
  cursor: string | null;
  hasMore: boolean;
}

@Injectable()
export class NFTService {
  private readonly MORALIS_API_URL = 'https://deep-index.moralis.io/api/v2.2';
  private readonly MORALIS_API_KEY = process.env.MORALIS_API_KEY;

  private readonly DEFAULT_LIMIT = 50;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  constructor(
    @InjectRepository(NFTEntity)
    private nftRepository: Repository<NFTEntity>,
  ) {}

  async getUserNFTs(
    walletAddress: string,
    forceRefresh = false,
    pagination?: PaginationParams,
  ): Promise<NFTsResponse> {
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      throw new BadRequestException('Invalid wallet address');
    }

    // Check if we have fresh cached data
    if (!forceRefresh) {
      const cachedNFTs = await this.getCachedNFTs(walletAddress, pagination);
      if (cachedNFTs) {
        return cachedNFTs;
      }
    }

    // Fetch fresh data from Moralis
    const moralisData = await this.fetchFromMoralis(walletAddress, pagination);

    // Update database with new data
    await this.updateNFTsCache(walletAddress, moralisData.nfts);

    return moralisData;
  }

  private async getCachedNFTs(
    walletAddress: string,
    pagination?: PaginationParams,
  ): Promise<NFTsResponse | null> {
    const cacheExpiryTime = new Date(Date.now() - this.CACHE_DURATION);

    const [nfts, total] = await this.nftRepository.findAndCount({
      where: {
        walletAddress,
        lastUpdated: MoreThan(cacheExpiryTime),
      },
      skip: pagination?.cursor ? parseInt(pagination.cursor) : 0,
      take: pagination?.limit || this.DEFAULT_LIMIT,
      order: {
        imageUrl: 'asc',
      },
    });

    if (nfts.length === 0) {
      return null;
    }

    const nextCursor =
      nfts.length + (pagination?.cursor ? parseInt(pagination.cursor) : 0);

    return {
      nfts: nfts.map((nft) => ({
        contractAddress: nft.contractAddress,
        tokenId: nft.tokenId,
        tokenStandard: nft.tokenStandard,
        name: nft.name,
        imageUrl: nft.imageUrl,
      })),
      cursor: nextCursor < total ? nextCursor.toString() : null,
      hasMore: nextCursor < total,
    };
  }

  private async updateNFTsCache(walletAddress: string, nfts: any[]) {
    const nftEntities = nfts.map((nft) => {
      const nftEntity = new NFTEntity();
      nftEntity.id = `${walletAddress}_${nft.contractAddress}_${nft.tokenId}`;
      nftEntity.walletAddress = walletAddress;
      nftEntity.contractAddress = nft.contractAddress;
      nftEntity.tokenId = nft.tokenId;
      nftEntity.tokenStandard = nft.tokenStandard;
      nftEntity.name = nft.name;
      nftEntity.imageUrl = nft.imageUrl;
      nftEntity.lastUpdated = new Date();
      return nftEntity;
    });

    // Use upsert to handle both new and existing NFTs
    await this.nftRepository.upsert(nftEntities, ['id']);
  }

  private async fetchFromMoralis(
    walletAddress: string,
    pagination?: PaginationParams,
  ): Promise<NFTsResponse> {
    try {
      const response = await axios.get(
        `${this.MORALIS_API_URL}/${walletAddress}/nft`,
        {
          params: {
            chain: 'polygon',
            format: 'decimal',
            media_items: true,
            limit: pagination?.limit || this.DEFAULT_LIMIT,
            cursor: pagination?.cursor || null,
          },
          headers: {
            'X-API-Key': this.MORALIS_API_KEY,
          },
        },
      );

      const nfts = response.data.result.map((nft: any) => ({
        contractAddress: nft.token_address,
        tokenId: nft.token_id,
        tokenStandard: nft.contract_type,
        name: nft.name || 'Unknown NFT',
        imageUrl: nft.metadata ? JSON.parse(nft.metadata).image : '',
      }));

      return {
        nfts,
        cursor: response.data.cursor || null,
        hasMore: !!response.data.cursor,
      };
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      throw new BadRequestException('Failed to fetch NFTs');
    }
  }
}
