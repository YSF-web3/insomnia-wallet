import { IsNotEmpty, IsEthereumAddress, IsString } from 'class-validator';

export class SignInDto {
  @IsEthereumAddress()
  @IsNotEmpty()
  walletAddress: string;
}

export class VerifySignatureDto {
  @IsEthereumAddress()
  @IsNotEmpty()
  walletAddress: string;

  @IsString()
  @IsNotEmpty()
  signature: string;
}
