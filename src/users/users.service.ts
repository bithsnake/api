import { Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UserResponse } from './users.interface';
import { UpdateUserDto } from './update-user-dto';
import { CreateUserDto } from './create-user-dto';

const userSelect = {
  id: true,
  name: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
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
export class UserService {
  constructor(private prisma: PrismaService) {}

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

  async getUserById(id: number): Promise<UserResponse | null> {
    return this.prisma.user.findUnique({
      select: userSelect,
      where: { id },
    });
  }

  async getUsers(): Promise<UserResponse[]> {
    return this.prisma.user.findMany({
      select: userSelect,
    });
  }

  async getUsersByRole(role: Role): Promise<UserResponse[]> {
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
}
