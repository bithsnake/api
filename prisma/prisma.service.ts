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
    const postgresCode = (error as { cause?: { code?: string } })?.cause?.code;
    if (postgresCode === '23001' || postgresCode === '23503') {
      throw new ConflictException(
        'Cannot delete ' +
          subject +
          ' because it is referenced by other records.',
      );
    }

    switch ((error as Prisma.PrismaClientKnownRequestError).code) {
      case PRISMA_ERRORS.UNIQUE_CONSTRAINT_VIOLATION:
        throw new ConflictException(
          `${subject} already exists. Please choose a different value.`,
        );
      case PRISMA_ERRORS.RECORD_NOT_FOUND:
        throw new NotFoundException(`${subject} not found.`);
      case PRISMA_ERRORS.FOREIGN_KEY_CONSTRAINT_VIOLATION:
        throw new ConflictException(
          `Cannot delete ${subject} because it is referenced by other records.`,
        );
      case PRISMA_ERRORS.RELATION_VIOLATION:
        throw new ConflictException(
          `Cannot delete ${subject} because it has related records.`,
        );
      default:
        console.error('Prisma error:', error);
        throw new InternalServerErrorException(unknownErrorMessage);
    }
  }
}
