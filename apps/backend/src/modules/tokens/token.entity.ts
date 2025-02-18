import { Entity, PrimaryColumn, Column } from 'typeorm';

// Entity for storing tokens
@Entity()
export class TokenEntity {
  @PrimaryColumn()
  id: string; // Composite of wallet_address and token_address

  @Column()
  walletAddress: string;

  @Column()
  contractAddress: string;

  @Column()
  name: string;

  @Column()
  symbol: string;

  @Column()
  decimals: number;

  @Column('decimal')
  balance: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column()
  possibleSpam: boolean;

  @Column()
  lastUpdated: Date;
}
