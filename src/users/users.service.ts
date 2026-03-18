/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRequest, UserResponse } from './users.interface';

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

  async create(body: UserRequest): Promise<UserResponse> {
    const { name, firstName, lastName, email, specialization } = body;
    return this.prisma.user.create({
      data: {
        name,
        firstName,
        lastName,
        email,
        specializationId: specialization ? Number(specialization) : null,
      },
      select: userSelect,
    });
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

  async update(id: number, body: UserRequest): Promise<UserResponse> {
    const { name, firstName, lastName, email, specialization } = body;
    return this.prisma.user.update({
      where: { id },
      data: {
        name,
        firstName,
        lastName,
        email,
        specializationId: specialization ? Number(specialization) : null,
      },
      select: userSelect,
    });
  }
}
