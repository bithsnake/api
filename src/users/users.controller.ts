import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UserService } from './users.service';
import type { UserRequest, UserResponse } from './users.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() body: UserRequest): Promise<boolean> {
    try {
      const user = await this.userService.create(body);
      return user;
    } catch (error) {
      throw new Error(`Failed to create user: ${error}`);
    }
  }

  @Get(':id')
  async findUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ user: UserResponse }> {
    const user = await this.userService.findById(id);
    return { user };
  }
}
