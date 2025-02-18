import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  address: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column()
  nonce: string;

  @Column({ nullable: true })
  jwtToken?: string;

  @CreateDateColumn()
  createdAt: Date;
}
