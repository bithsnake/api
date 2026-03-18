import { Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UserResponse } from './users.interface';
import { UpdateUserDto } from './dto/update-user-dto';
import { CreateUserDto } from './dto/create-user-dto';
import { BaseService } from '../class-library';

export const userSelect: Prisma.UserSelect = {
  id: true,
  name: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
  appointments: true,
  updatedAt: true,
  createdAt: true,
  specializationId: true,
  specialization: {
    select: {
      id: true,
      name: true,
      type: true,
    },
  },
} satisfies Prisma.UserSelect;

@Injectable()
export class UserService extends BaseService<
  UserResponse,
  CreateUserDto,
  UpdateUserDto
> {
  protected __baseServiceBrand: never;
  constructor(private prisma: PrismaService) {
    super();
  }

  async create(body: CreateUserDto): Promise<UserResponse> {
    const { name, firstName, lastName, email, specializationId } = body;
    try {
      return await this.prisma.user.create({
        data: {
          name,
          firstName,
          lastName,
          email,
          specializationId: specializationId ? Number(specializationId) : null,
        },
        select: userSelect,
      });
    } catch (error) {
      this.prisma.handlePrismaWriteError(
        error,
        'User',
        'An error occurred while creating the user',
      );
    }
  }

  async getById(id: number): Promise<UserResponse | null> {
    return this.prisma.user.findUnique({
      select: userSelect,
      where: { id },
    });
  }

  async getAll(): Promise<UserResponse[]> {
    return this.prisma.user.findMany({
      select: userSelect,
    });
  }

  async getAllByRole(role: Role): Promise<UserResponse[]> {
    return this.prisma.user.findMany({
      select: userSelect,
      where: { role },
    });
  }

  async update(id: number, body: UpdateUserDto): Promise<UserResponse> {
    const data = {
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.firstName !== undefined ? { firstName: body.firstName } : {}),
      ...(body.lastName !== undefined ? { lastName: body.lastName } : {}),
      ...(body.email !== undefined ? { email: body.email } : {}),
      ...(body.specializationId !== undefined
        ? { specializationId: body.specializationId }
        : {}),
    };

    try {
      return await this.prisma.user.update({
        where: { id },
        data: {
          ...data,
        },
        select: userSelect,
      });
    } catch (error) {
      this.prisma.handlePrismaWriteError(
        error,
        `User`,
        `An error occurred while updating the user with id ${id}`,
      );
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      this.prisma.handlePrismaWriteError(
        error,
        `User`,
        `An error occurred while deleting the user with id ${id}`,
      );
    }
  }
}
