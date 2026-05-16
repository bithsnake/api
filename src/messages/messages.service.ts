import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message-dto';

export const messageSelect = {
  id: true,
  appointmentId: true,
  patientId: true,
  message: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type MessageRecord = Prisma.MessageGetPayload<{
  select: typeof messageSelect;
}>;

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateMessageDto): Promise<MessageRecord> {
    try {
      const prismaClient = this.prisma as PrismaClient;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      return await prismaClient.message.create({
        data: {
          appointmentId: body.appointmentId,
          patientId: body.patientId,
          message: body.message,
        },
        select: messageSelect,
      });
    } catch (error) {
      this.prisma.handlePrismaWriteError(
        error,
        'Message',
        'An error occurred while creating the message',
      );
      throw error;
    }
  }
}
