import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Appointment, Prisma } from '@prisma/client';
import { CreateAppointmentDto } from './create-appointment-dto';

export const appointMentSelect = {
  id: true,
  date: true,
  userId: true,
  name: true,
  patientId: true,
  createdAt: true,
  updatedAt: true,
  status: true,
} satisfies Prisma.AppointmentSelect;

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}
  async getAppointments(): Promise<Appointment[]> {
    try {
      return this.prisma.appointment.findMany({
        select: appointMentSelect,
      });
    } catch (error) {
      this.prisma.handlePrismaWriteError(
        error,
        'Appointments',
        'An error occurred while fetching the appointments',
      );
    }
  }

  async getAppointmentById(id: number): Promise<Appointment | null> {
    try {
      return this.prisma.appointment.findUnique({
        where: { id },
        select: appointMentSelect,
      });
    } catch (error) {
      this.prisma.handlePrismaWriteError(
        error,
        'Appointments',
        'An error occurred while fetching the appointment',
      );
    }
  }

  async createAppointment(body: CreateAppointmentDto): Promise<Appointment> {
    const { date, patientId, name, userId: doctorId } = body;

    try {
      return this.prisma.appointment.create({
        data: {
          date,
          userId: doctorId,
          patientId,
          name:
            name ||
            `Appointment for patient ${patientId} with doctor ${doctorId}`,
        },
        select: appointMentSelect,
      });
    } catch (error) {
      this.prisma.handlePrismaWriteError(
        error,
        'Appointment',
        'An error occurred while creating the appointment',
      );
    }
  }
}
