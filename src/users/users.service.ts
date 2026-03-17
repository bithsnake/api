/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRequest, UserResponse } from './users.interface';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(body: UserRequest): Promise<boolean> {
    const { name, email, specialization } = body;
    await this.prisma.user.create({
      data: {
        name,
        email,
        specialization,
      },
    });
    return true;
  }

  async findById(id: number): Promise<UserResponse> | never {
    const user = await this.prisma.user.findUnique({
      select: { name: true, email: true, specialization: true, id: true },
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} was not found`);
    }

    return new Promise<UserResponse>((resolve): void => resolve(user));
  }
}
