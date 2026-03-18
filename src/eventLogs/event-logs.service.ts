import { Injectable } from '@nestjs/common';
import {
  AppointmentEventLog,
  BillingEventLog,
  Prisma,
  ReminderEventLog,
  UserEventLog,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const appointmentEventLogSelect = {
  id: true,
  appointmentId: true,
  eventType: true,
  event: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.AppointmentEventLogSelect;

const billingEventLogSelect = {
  id: true,
  billingId: true,
  eventType: true,
  event: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.BillingEventLogSelect;

const reminderEventLogSelect = {
  id: true,
  reminderId: true,
  eventType: true,
  event: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ReminderEventLogSelect;

const userEventLogSelect = {
  id: true,
  userId: true,
  eventType: true,
  event: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserEventLogSelect;

@Injectable()
export class EventLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAppointmentEventLogs(
    appointmentId: number,
  ): Promise<AppointmentEventLog[]> {
    try {
      return await this.prisma.appointmentEventLog.findMany({
        where: { appointmentId },
        select: appointmentEventLogSelect,
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      this.prisma.handlePrismaWriteError(
        error,
        'Appointment event logs',
        'An error occurred while retrieving appointment event logs',
      );
    }
  }

  async getBillingEventLogs(billingId: number): Promise<BillingEventLog[]> {
    try {
      return await this.prisma.billingEventLog.findMany({
        where: { billingId },
        select: billingEventLogSelect,
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      this.prisma.handlePrismaWriteError(
        error,
        'Billing event logs',
        'An error occurred while retrieving billing event logs',
      );
    }
  }

  async getReminderEventLogs(reminderId: number): Promise<ReminderEventLog[]> {
    try {
      return await this.prisma.reminderEventLog.findMany({
        where: { reminderId },
        select: reminderEventLogSelect,
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      this.prisma.handlePrismaWriteError(
        error,
        'Reminder event logs',
        'An error occurred while retrieving reminder event logs',
      );
    }
  }

  async getUserEventLogs(userId: number): Promise<UserEventLog[]> {
    try {
      return await this.prisma.userEventLog.findMany({
        where: { userId },
        select: userEventLogSelect,
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      this.prisma.handlePrismaWriteError(
        error,
        'User event logs',
        'An error occurred while retrieving user event logs',
      );
    }
  }
}
