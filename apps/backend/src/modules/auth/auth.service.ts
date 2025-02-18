import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ethers } from 'ethers';

import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async signIn(address: string): Promise<{ nonce: string; user: any }> {
    let user = await this.userRepo.findOne({ where: { address } });

    if (!user) {
      user = this.userRepo.create({
        address,
        nonce: Math.floor(Math.random() * 1000000).toString(),
      });

      await this.userRepo.save(user);
      return { nonce: user.nonce, user };
    }

    return { nonce: user.nonce, user };
  }

  async verifySignature(
    address: string,
    signature: string,
  ): Promise<{ token: string; user: UserEntity }> {
    const user = await this.userRepo.findOne({ where: { address } });

    if (!user) throw new UnauthorizedException('User not found');

    // Recover signer from signature
    const recoveredAddress = ethers.verifyMessage(user.nonce, signature);

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      throw new UnauthorizedException('Invalid signature');
    }

    // Generate JWT token
    const token = this.jwtService.sign({ address });
    console.log('JWT', token);

    // Save token in the database
    user.jwtToken = token;

    // Generate a new nonce for future logins
    user.nonce = Math.floor(Math.random() * 1000000).toString();

    await this.userRepo.save(user);

    return { token, user };
  }

  async registerUser(
    address: string,
    username: string,
    signature: string,
  ): Promise<{ token: string }> {
    const existingUser = await this.userRepo.findOne({
      where: { address },
    });

    if (!existingUser) {
      throw new UnauthorizedException(
        'Wallet not recognized. Please sign in first.',
      );
    }

    if (existingUser.username) {
      throw new BadRequestException('Username already set');
    }

    // Recover signer from signature
    const recoveredAddress = ethers.verifyMessage(
      existingUser.nonce,
      signature,
    );

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      throw new UnauthorizedException('Invalid signature');
    }

    // Ensure username is unique
    const usernameExists = await this.userRepo.findOne({ where: { username } });

    if (usernameExists) {
      throw new BadRequestException('Username already taken');
    }

    // Save username
    existingUser.username = username;
    await this.userRepo.save(existingUser);

    // Generate JWT token
    const token = this.jwtService.sign({ address });

    return { token };
  }
}
