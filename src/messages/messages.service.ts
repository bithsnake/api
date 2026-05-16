import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message-dto';

const messageSelect = {
  id: true,
  appointmentId: true,
  patientId: true,
  message: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.MessageSelect;

export type MessageRecord = Prisma.MessageGetPayload<{
  select: typeof messageSelect;
}>;

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateMessageDto): Promise<MessageRecord> {
    try {
      return await this.prisma.message.create({
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
    }
  }
}
