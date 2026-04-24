import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { BaseController } from '../class-library';
import { CreateReminderDto } from './dto/create-reminder-dto';
import { UpdateReminderDto } from './dto/update-reminder-dto';
import { ReminderRecord, RemindersService } from './reminders.service';

@Controller('reminders')
export class RemindersController extends BaseController<
  ReminderRecord,
  CreateReminderDto,
  UpdateReminderDto,
  RemindersService
> {
  constructor(private readonly remindersService: RemindersService) {
    super(remindersService);
  }

  @Get('appointment/:appointmentId')
  getAllByAppointmentId(
    @Param('appointmentId', ParseIntPipe) appointmentId: number,
  ): Promise<ReminderRecord[]> {
    return this.remindersService.getAllByAppointmentId(appointmentId);
  }
}
