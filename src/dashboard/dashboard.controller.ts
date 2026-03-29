import { Controller, Get } from '@nestjs/common';
import { BaseController } from '../class-library';
import {
  AppointMentWidgetItem,
  BillingWidgetItem,
  DashboardService,
  ReminderWidgetItem,
} from './dashboard.service';

@Controller('dashboard')
export class DashboardController extends BaseController<
  any,
  any,
  any,
  DashboardService
> {
  constructor(private readonly dashboardService: DashboardService) {
    super(dashboardService);
  }

  @Get('widgets')
  async getDashboardWidgets() {
    const data = await this.dashboardService.getAll();

    const appointMentWidgetItem: AppointMentWidgetItem = data.find(
      (item) => item.type === 'APPOINTMENTS',
    );

    const billingWidgetItem: BillingWidgetItem = data.find(
      (item) => item.type === 'BILLINGS',
    );

    const remindersWidgetItem: ReminderWidgetItem = data.find(
      (item) => item.type === 'REMINDERS',
    );
    return {
      appointMentWidgetItem,
      billingWidgetItem,
      remindersWidgetItem,
    };
  }
}
