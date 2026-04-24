import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseService } from '../class-library';
import { Appointment, Billing, Prisma } from '@prisma/client';
import { appointMentSelect } from '../appointments/appointments.service';
import { billingSelect } from '../billings/billings.service';
import { reminderSelect } from '../reminders/reminders.service';
import { formatDateTime } from '../utils/date-utils';
export type AppointMentWidgetItem = {
  type: 'APPOINTMENTS';
  upcoming: (Appointment & { lastRemindedAt?: string | null })[];
  past: (Appointment & { lastRemindedAt?: string | null })[];
  cancelled: (Appointment & { lastRemindedAt?: string | null })[];
};

export type BillingWidgetItem = {
  type: 'BILLINGS';
  pending: Billing[];
  paid: Billing[];
  overdue: Billing[];
  draft: Billing[];
};

const dashboardReminderSelect = {
  ...reminderSelect,
  appointment: { select: { name: true } },
} satisfies Prisma.ReminderSelect;

type ReminderWidgetDataItem = Prisma.ReminderGetPayload<{
  select: typeof dashboardReminderSelect;
}> & {
  appointmentName?: string;
  billingName?: string;
  userName?: string;
};

export type ReminderWidgetItem = {
  type: 'REMINDERS';
  data: ReminderWidgetDataItem[];
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
        upcoming: appointMentsThirtyDaysAgo
          .filter((appointment) => appointment.status === 'SCHEDULED')
          .map((appointment) => ({
            ...appointment,
            lastRemindedAt: appointment.reminders[0]?.createdAt
              ? formatDateTime(appointment.reminders[0]?.createdAt)
              : null,
          })),
        past: appointMentsThirtyDaysAgo
          .filter((appointment) => appointment.status === 'COMPLETED')
          .map((appointment) => ({
            ...appointment,
            lastRemindedAt: appointment.reminders[0]?.createdAt
              ? formatDateTime(appointment.reminders[0]?.createdAt)
              : null,
          })),
        cancelled: appointMentsThirtyDaysAgo
          .filter((appointment) => appointment.status === 'CANCELED')
          .map((appointment) => ({
            ...appointment,
            lastRemindedAt: appointment.reminders[0]?.createdAt
              ? formatDateTime(appointment.reminders[0]?.createdAt)
              : null,
          })),
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
          select: dashboardReminderSelect,
          orderBy: {
            createdAt: 'desc',
          },
        });

      const appointmentReminderWidgetItem: ReminderWidgetItem = {
        type: 'REMINDERS',
        data: appointMentRemindersThirtyDaysAgo.map((reminder) => ({
          ...reminder,
          appointmentName: reminder.appointment?.name,
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
