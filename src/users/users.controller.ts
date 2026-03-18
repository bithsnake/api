import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { UserService } from './users.service';
import type { UserRequest, UserResponse } from './users.interface';
import { ApiResponse } from '../../api.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async getUsers(): Promise<ApiResponse<UserResponse[]>> {
    try {
      const users = await this.userService.getUsers();
      return { success: true, data: users };
    } catch (error) {
      return { success: false, error: `Failed to retrieve users: ${error}` };
    }
  }

  @Post()
  async createUser(
    @Body() body: UserRequest,
  ): Promise<ApiResponse<UserResponse>> {
    try {
      const user = await this.userService.create(body);
      if (!user) {
        return { success: false, error: 'User creation failed' };
      }
      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: `Failed to create user: ${error}` };
    }
  }

  @Get(':id')
  async findUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<UserResponse>> {
    try {
      const user = await this.userService.getUserById(id);
      if (!user) {
        return { success: false, error: `User with id ${id} not found` };
      }
      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: `Failed to retrieve user: ${error}` };
    }
  }

  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UserRequest,
  ): Promise<ApiResponse<UserResponse>> {
    const updatedUser = await this.userService.update(id, body);

    if (!updatedUser) {
      return { success: false, error: `Failed to update user with id ${id}` };
    }

    return { success: true, data: updatedUser };
  }
  @Get('role/:role')
  async findUsersByRole(
    @Param('role', new ParseEnumPipe(Role)) role: Role,
  ): Promise<ApiResponse<UserResponse[]>> {
    try {
      const users = await this.userService.getUsersByRole(role);
      return { success: true, data: users };
    } catch (error) {
      return { success: false, error: `Failed to retrieve users: ${error}` };
    }
  }
}
