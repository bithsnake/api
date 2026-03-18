import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Appointment } from '@prisma/client';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './create-appointment-dto';

@Controller()
export class AppointmentsController {
  constructor(readonly appointmentsService: AppointmentsService) {}
  @Get()
  async getAppointments(): Promise<Appointment[]> {
    return this.appointmentsService.getAppointments();
  }

  @Get(':id')
  async getAppointmentById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Appointment | null> {
    return this.appointmentsService.getAppointmentById(id);
  }

  @Post()
  async createAppointment(
    @Body() body: CreateAppointmentDto,
  ): Promise<Appointment> {
    return await this.appointmentsService.createAppointment(body);
  }
}
