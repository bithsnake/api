import { Injectable } from '@nestjs/common';
import { Prisma, Reminder } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseService } from '../class-library';
import { CreateReminderDto } from './dto/create-reminder-dto';
import { UpdateReminderDto } from './dto/update-reminder-dto';

export const reminderSelect = {
  id: true,
  appointmentId: true,
  message: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ReminderSelect;

@Injectable()
export class RemindersService extends BaseService<
  Reminder,
  CreateReminderDto,
  UpdateReminderDto
> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(body: CreateReminderDto): Promise<Reminder> {
    try {
      return await this.prisma.reminder.create({
        data: {
          appointmentId: body.appointmentId,
          message: body.message,
        },
        select: reminderSelect,
      });
    } catch (error) {
      this.prisma.handlePrismaWriteError(
        error,
        'Reminder',
        'An error occurred while creating the reminder',
      );
    }
  }

  async getById(id: number): Promise<Reminder | null> {
    try {
      return await this.prisma.reminder.findUnique({
        where: { id },
        select: reminderSelect,
      });
    } catch (error) {
      this.prisma.handlePrismaWriteError(
        error,
        'Reminder',
        'An error occurred while retrieving the reminder',
      );
    }
  }

  async getAll(): Promise<Reminder[]> {
    try {
      return await this.prisma.reminder.findMany({
        select: reminderSelect,
      });
    } catch (error) {
      this.prisma.handlePrismaWriteError(
        error,
        'Reminder',
        'An error occurred while retrieving reminders',
      );
    }
  }

  async update(id: number, body: UpdateReminderDto): Promise<Reminder> {
    const data = {
      ...(body.appointmentId !== undefined
        ? { appointmentId: body.appointmentId }
        : {}),
      ...(body.message !== undefined ? { message: body.message } : {}),
    };

    try {
      return await this.prisma.reminder.update({
        where: { id },
        data,
        select: reminderSelect,
      });
    } catch (error) {
      this.prisma.handlePrismaWriteError(
        error,
        'Reminder',
        'An error occurred while updating the reminder',
      );
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.prisma.reminder.delete({ where: { id } });
    } catch (error) {
      this.prisma.handlePrismaWriteError(
        error,
        'Reminder',
        'An error occurred while deleting the reminder',
      );
    }
  }

  async getAllByAppointmentId(appointmentId: number): Promise<Reminder[]> {
    try {
      return await this.prisma.reminder.findMany({
        where: { appointmentId },
        select: reminderSelect,
      });
    } catch (error) {
      this.prisma.handlePrismaWriteError(
        error,
        'Reminder',
        'An error occurred while retrieving reminders for the appointment',
      );
    }
  }
}
