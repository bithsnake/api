/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { PRISMA_ERRORS } from './prisma.constants';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // break out error handling
  handlePrismaWriteError(
    error: unknown,
    subject: string,
    unknownErrorMessage: string,
  ): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === PRISMA_ERRORS.UNIQUE_CONSTRAINT_VIOLATION
    ) {
      throw new ConflictException(`${subject} already exists`);
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === PRISMA_ERRORS.RECORD_NOT_FOUND
    ) {
      throw new NotFoundException(`${subject} not found`);
    }

    throw new InternalServerErrorException(unknownErrorMessage);
  }
}
