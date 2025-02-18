import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('nfts')
export class NFTEntity {
  @PrimaryColumn()
  id: string; // Composite of walletAddress_contractAddress_tokenId

  @Column()
  walletAddress: string;

  @Column()
  contractAddress: string;

  @Column()
  tokenId: string;

  @Column()
  tokenStandard: string;

  @Column()
  name: string;

  @Column()
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  lastUpdated: Date;
}
