import { Controller } from '@nestjs/common';
import { Appointment } from '@prisma/client';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment-dto';
import { BaseController } from '../class-library';
import { UpdateAppointmentDto } from './dto/update-appointment-dto';

@Controller('appointments')
export class AppointmentsController extends BaseController<
  Appointment,
  CreateAppointmentDto,
  UpdateAppointmentDto,
  AppointmentsService
> {
  constructor(readonly appointmentsService: AppointmentsService) {
    super(appointmentsService);
  }
}
