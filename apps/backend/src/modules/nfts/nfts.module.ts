import { Module } from '@nestjs/common';

import { NftsController } from './nfts.controller';
import { NFTService } from './nfts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NFTEntity } from './nft.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NFTEntity])],

  providers: [NFTService],
  controllers: [NftsController],
  exports: [NFTService],
})
export class NftsModule {}
