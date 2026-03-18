/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRequest, UserResponse } from './users.interface';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(body: UserRequest): Promise<UserResponse> {
    const { name, email, specialization } = body;
    return await this.prisma.user.create({
      data: {
        name,
        email,
        specialization,
      },
    });
  }

  async getUserById(id: number): Promise<UserResponse> | never {
    return await this.prisma.user.findUnique({
      select: { id: true, name: true, email: true, specialization: true },
      where: { id },
    });
  }

  async getUsers(): Promise<UserResponse[]> {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async update(id: number, body: UserRequest): Promise<UserResponse> {
    const { name, email, specialization } = body;
    return await this.prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        specialization,
      },
    });
  }
}
