import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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

export type ReminderRecord = Prisma.ReminderGetPayload<{
  select: typeof reminderSelect;
}>;

@Injectable()
export class RemindersService extends BaseService<
  ReminderRecord,
  CreateReminderDto,
  UpdateReminderDto
> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  private async enqueueReminderJob(
    reminder: ReminderRecord,
    appointmentId: number,
  ): Promise<void> {
    const workerUrl =
      process.env.WORKER_URL ?? 'http://localhost:4001/jobs/reminder';

    try {
      const response = await fetch(workerUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          reminderId: reminder.id,
          appointmentId,
          patientId: 0,
          scheduledFor: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(
          '[RemindersService] Worker enqueue failed:',
          response.status,
          text,
        );
      }
    } catch (error) {
      console.error('[RemindersService] Worker enqueue error:', error);
    }
  }

  async create(body: CreateReminderDto): Promise<ReminderRecord> {
    try {
      const createdReminder = await this.prisma.reminder.create({
        data: {
          appointmentId: body.appointmentId,
          message: body.message,
        },
        select: reminderSelect,
      });

      void this.enqueueReminderJob(createdReminder, body.appointmentId);

      return createdReminder;
    } catch (error) {
      this.prisma.handlePrismaWriteError(
        error,
        'Reminder',
        'An error occurred while creating the reminder',
      );
    }
  }

  async getById(id: number): Promise<ReminderRecord | null> {
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

  async getAll(): Promise<ReminderRecord[]> {
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

  async update(id: number, body: UpdateReminderDto): Promise<ReminderRecord> {
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

  async getAllByAppointmentId(
    appointmentId: number,
  ): Promise<ReminderRecord[]> {
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
