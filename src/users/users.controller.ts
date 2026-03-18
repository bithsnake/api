import { Controller, Get, Param, ParseEnumPipe } from '@nestjs/common';
import { UserService } from './users.service';
import type { UserResponse } from './users.interface';
import { UpdateUserDto } from './dto/update-user-dto';
import { CreateUserDto } from './dto/create-user-dto';
import { BaseController } from '../class-library';
import { Role } from '@prisma/client';

@Controller('users')
export class UsersController extends BaseController<
  UserResponse,
  CreateUserDto,
  UpdateUserDto,
  UserService
> {
  constructor(private readonly userService: UserService) {
    super(userService);
  }

  // Additional endpoint to get users by role
  @Get('role/:role')
  async getAllByRole(
    @Param('role', new ParseEnumPipe(Role)) role: Role,
  ): Promise<UserResponse[]> {
    return this.userService.getAllByRole(role);
  }
}
