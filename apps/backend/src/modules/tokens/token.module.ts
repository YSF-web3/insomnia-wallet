import { Module } from '@nestjs/common';
import { TokensService } from './token.service';
import { TokensController } from './token.controller';
import { TokenEntity } from './token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity])],
  providers: [TokensService],
  controllers: [TokensController],
  exports: [TokensService],
})
export class TokensModule {}
