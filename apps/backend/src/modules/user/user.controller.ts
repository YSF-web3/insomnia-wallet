import { Controller, Get, Param, Query } from '@nestjs/common';

import { UserEntity } from './user.entity'; // Adjust the import path accordingly
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Endpoint to search for users by query (username or address).
   * @param query - The username or address to search for.
   * @returns A list of users that match the query.
   */
  @Get('search')
  async searchUsers(@Query('query') query: string): Promise<UserEntity[]> {
    if (!query) {
      throw new Error('Query parameter is required');
    }
    return this.userService.searchUsers(query);
  }

  /**
   * Endpoint to fetch a user by their unique ID.
   * @param id - The unique identifier (ID) of the user.
   * @returns A user object if found.
   */
  @Get(':id')
  async getUserById(
    @Param('id') id: string,
  ): Promise<UserEntity | { message: string }> {
    const user = await this.userService.getUserById(id); // Convert string to number
    if (!user) {
      return { message: 'User not found' };
    }
    return user;
  }
}
