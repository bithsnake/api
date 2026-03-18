import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import {
  AppointmentEventLog,
  BillingEventLog,
  ReminderEventLog,
  UserEventLog,
} from '@prisma/client';
import { EventLogsService } from './event-logs.service';

@Controller('event-logs')
export class EventLogsController {
  constructor(private readonly eventLogsService: EventLogsService) {}

  @Get('appointments/:appointmentId')
  async getAppointmentEventLogs(
    @Param('appointmentId', ParseIntPipe) appointmentId: number,
  ): Promise<AppointmentEventLog[]> {
    return this.eventLogsService.getAppointmentEventLogs(appointmentId);
  }

  @Get('billings/:billingId')
  async getBillingEventLogs(
    @Param('billingId', ParseIntPipe) billingId: number,
  ): Promise<BillingEventLog[]> {
    return this.eventLogsService.getBillingEventLogs(billingId);
  }

  @Get('reminders/:reminderId')
  async getReminderEventLogs(
    @Param('reminderId', ParseIntPipe) reminderId: number,
  ): Promise<ReminderEventLog[]> {
    return this.eventLogsService.getReminderEventLogs(reminderId);
  }

  @Get('users/:userId')
  async getUserEventLogs(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<UserEventLog[]> {
    return this.eventLogsService.getUserEventLogs(userId);
  }
}
