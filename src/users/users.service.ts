/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRequest, UserResponse } from './users.interface';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(body: UserRequest): Promise<UserResponse> {
    const { name, firstName, lastName, email, specialization } = body;
    return await this.prisma.user.create({
      data: {
        name,
        firstName,
        lastName,
        email,
        specialization,
      },
    });
  }

  async getUserById(id: number): Promise<UserResponse> | never {
    return await this.prisma.user.findUnique({
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        email: true,
        specialization: true,
      },
      where: { id },
    });
  }

  async getUsers(): Promise<UserResponse[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        email: true,
        specialization: true,
      },
    });
    return users;
  }

  async update(id: number, body: UserRequest): Promise<UserResponse> {
    const { name, firstName, lastName, email, specialization } = body;
    return await this.prisma.user.update({
      where: { id },
      data: {
        name,
        firstName,
        lastName,
        email,
        specialization,
      },
    });
  }
}
