import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Like, Repository } from 'typeorm';
import { UserEntity } from './user.entity'; // Assuming this is your user entity

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  /**
   * Search for users by either username or address.
   * @param query - The username or address to search for.
   * @returns An array of user objects matching the query.
   */
  async searchUsers(query: string): Promise<UserEntity[]> {
    return this.userRepo.find({
      where: [
        { username: Like(`%${query}%`) }, // Search for users with a username matching the query
        { address: Like(`%${query}%`) }, // Search for users with an address matching the query
      ] as any,
    });
  }

  /**
   * Fetch a user by their unique ID.
   * @param id - The unique identifier (ID) of the user.
   * @returns A user object if found.
   */
  async getUserById(id: string): Promise<UserEntity | null> {
    return this.userRepo.findOne({
      where: { id },
    });
  }
}
