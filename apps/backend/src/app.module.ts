import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import TypeOrmConfigService from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/user/users.module';
import { AuthController } from './modules/auth/auth.controller';
import { NftsModule } from './modules/nfts/nfts.module';
import { NftsController } from './modules/nfts/nfts.controller';
import { TokensModule } from './modules/tokens/token.module';
import { UserService } from './modules/user/user.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthModule,
    UsersModule,
    NftsModule,
    TokensModule,
  ],
  controllers: [AppController, AuthController, NftsController],
  providers: [AppService],
})
export class AppModule {}
