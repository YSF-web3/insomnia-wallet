import { Controller, Get, Param, Query } from '@nestjs/common';
import { NFTService } from './nfts.service';

@Controller('nfts')
export class NftsController {
  constructor(private readonly nftsService: NFTService) {}

  @Get(':walletAddress')
  async getNFTs(
    @Param('walletAddress') walletAddress: string,
    @Query('limit') limit?: number,
    @Query('cursor') cursor?: string,
  ) {
    console.log('Here');

    return this.nftsService.getUserNFTs(walletAddress, false, {
      limit: limit,
      cursor,
    });
  }
}
