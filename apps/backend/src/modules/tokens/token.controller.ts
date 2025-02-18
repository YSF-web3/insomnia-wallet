import { Controller, Get, Param, Query } from '@nestjs/common';
import { TokensResponse, TokensService } from './token.service';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokenService: TokensService) {}

  @Get(':walletAddress')
  async getNFTs(
    @Param('walletAddress') walletAddress: string,
    @Query('limit') limit?: number,
    @Query('cursor') cursor?: string,
  ) {
    return await this.tokenService.getUserTokens(walletAddress, false, {
      limit: limit,
      cursor,
    });
  }
}
