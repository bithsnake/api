import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseService } from '../class-library';
import { Appointment, Billing, Reminder } from '@prisma/client';
import { appointMentSelect } from '../appointments/appointments.service';
import { billingSelect } from '../billings/billings.service';
import { reminderSelect } from '../reminders/reminders.service';

export type AppointMentWidgetItem = {
  type: 'APPOINTMENTS';
  upcoming: Appointment[];
  past: Appointment[];
  cancelled: Appointment[];
};

export type BillingWidgetItem = {
  type: 'BILLINGS';
  pending: Billing[];
  paid: Billing[];
  overdue: Billing[];
  draft: Billing[];
};

export type ReminderWidgetItem = {
  type: 'REMINDERS';
  data: Reminder[] & { appointmentName: string }[];
};

const thirtyDays = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

@Injectable()
export class DashboardService extends BaseService<
  AppointMentWidgetItem | BillingWidgetItem | ReminderWidgetItem,
  any,
  any
> {
  protected __baseServiceBrand: never;
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  create(body: any): Promise<any> {
    void body;
    throw new Error('Method not implemented.');
  }
  getById(id: number): Promise<any> {
    void id;
    throw new Error('Method not implemented.');
  }
  async getAll(): Promise<
    (AppointMentWidgetItem | BillingWidgetItem | ReminderWidgetItem)[]
  > {
    try {
      const appointMentsThirtyDaysAgo = await this.prisma.appointment.findMany({
        where: {
          date: {
            gte: new Date(Date.now() - thirtyDays),
          },
        },
        select: appointMentSelect,
        orderBy: {
          createdAt: 'desc',
        },
      });

      const appointmentWidgetItem: AppointMentWidgetItem = {
        type: 'APPOINTMENTS',
        upcoming: appointMentsThirtyDaysAgo.filter(
          (appointment) => appointment.status === 'SCHEDULED',
        ),
        past: appointMentsThirtyDaysAgo.filter(
          (appointment) => appointment.status === 'COMPLETED',
        ),
        cancelled: appointMentsThirtyDaysAgo.filter(
          (appointment) => appointment.status === 'CANCELED',
        ),
      };

      const billingsThirtyDaysAgo = await this.prisma.billing.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - thirtyDays),
          },
        },
        select: billingSelect,
        orderBy: {
          createdAt: 'desc',
        },
      });

      const billingWidgetItem: BillingWidgetItem = {
        type: 'BILLINGS',
        paid: billingsThirtyDaysAgo.filter(
          (billing) => billing.status === 'PAID',
        ),
        pending: billingsThirtyDaysAgo.filter(
          (billing) => billing.status === 'INVOICED',
        ),
        overdue: billingsThirtyDaysAgo.filter(
          (billing) => billing.status === 'OVERDUE',
        ),
        draft: billingsThirtyDaysAgo.filter(
          (billing) => billing.status === 'DRAFT',
        ),
      };

      const appointMentRemindersThirtyDaysAgo =
        await this.prisma.reminder.findMany({
          where: {
            createdAt: {
              gte: new Date(Date.now() - thirtyDays),
            },
          },
          select: {
            ...reminderSelect,
            appointment: { select: { name: true } },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

      const appointmentReminderWidgetItem: ReminderWidgetItem = {
        type: 'REMINDERS',
        data: appointMentRemindersThirtyDaysAgo.map((reminder) => ({
          ...reminder,
          appointmentName: reminder.appointment.name,
        })),
      };

      await this.prisma.$disconnect(); // Disconnect from Prisma
      return [
        appointmentWidgetItem,
        billingWidgetItem,
        appointmentReminderWidgetItem,
      ];
    } catch (error) {
      this.prisma.handlePrismaWriteError(
        error,
        'Dashboard',
        'An error occurred while fetching dashboard widgets',
      );
    }
  }
  update(id: number, body: any): Promise<any> {
    void id;
    void body;
    throw new Error('Method not implemented.');
  }
  delete(id: number): Promise<void> {
    void id;
    throw new Error('Method not implemented.');
  }
}
