import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserService } from '../user/user.service';
import { User } from '../user/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    userService: UserService,
  ) {}

  @Get('whoami')
  @UseGuards(JwtAuthGuard)
  async whoami(@User() user: any) {
    console.log('User');

    const { userId, username, address } = user;
    return {
      userId,
      username,
      address,
    };
  }

  @Post('signin')
  async signIn(@Body('walletAddress') walletAddress: string) {
    return this.authService.signIn(walletAddress);
  }

  @Post('verify')
  async verify(@Body() body: { walletAddress: string; signature: string }) {
    return this.authService.verifySignature(body.walletAddress, body.signature);
  }

  @Post('register')
  async register(
    @Body()
    body: {
      walletAddress: string;
      username: string;
      signature: string;
    },
  ) {
    return this.authService.registerUser(
      body.walletAddress,
      body.username,
      body.signature,
    );
  }
}
