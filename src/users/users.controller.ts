import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { UserService } from './users.service';
import type { UserResponse } from './users.interface';
import { ApiResponse } from '../../api.interface';
import { UpdateUserDto } from './update-user-dto';
import { CreateUserDto } from './create-user-dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<ApiResponse<UserResponse[]>> {
    try {
      const users = await this.userService.getUsers();
      return { success: true, data: users };
    } catch {
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  @Post()
  async createUser(
    @Body() body: CreateUserDto,
  ): Promise<ApiResponse<UserResponse>> {
    const user = await this.userService.create(body);
    return { success: true, data: user };
  }

  @Get(':id')
  async findUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<UserResponse>> {
    try {
      const user = await this.userService.getUserById(id);
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      return { success: true, data: user };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Failed to retrieve user with id ${id}`,
      );
    }
  }

  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ): Promise<ApiResponse<UserResponse>> {
    const updatedUser = await this.userService.update(id, body);
    return { success: true, data: updatedUser };
  }

  @Get('role/:role')
  async findUsersByRole(
    @Param('role', new ParseEnumPipe(Role)) role: Role,
  ): Promise<ApiResponse<UserResponse[]>> {
    try {
      const users = await this.userService.getUsersByRole(role);
      return { success: true, data: users };
    } catch {
      throw new InternalServerErrorException(
        `Failed to retrieve users with role ${role}`,
      );
    }
  }
}
