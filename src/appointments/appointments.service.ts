import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Appointment, Prisma } from '@prisma/client';
import { CreateAppointmentDto } from './dto/create-appointment-dto';
import { BaseService } from '../class-library';
import { UpdateAppointmentDto } from './dto/update-appointment-dto';
import { patientSelect } from '../patients/patients.service';
import { userSelect } from '../users/users.service';
import { billingSelect } from '../billings/billings.service';

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
export class AppointmentsService extends BaseService<
  Appointment,
  CreateAppointmentDto,
  UpdateAppointmentDto
> {
  protected __baseServiceBrand: never;
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async getAll(): Promise<Appointment[]> {
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

  async getById(id: number): Promise<Appointment | null> {
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

  async create(body: CreateAppointmentDto): Promise<Appointment> {
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

  async delete(id: number): Promise<void> {
    try {
      await this.prisma.appointment.update({
        where: { id },
        data: { status: 'DELETED' },
      });
    } catch (error) {
      this.prisma.handlePrismaWriteError(
        error,
        'Appointment',
        'An error occurred while deleting the appointment',
      );
    }
  }

  async update(id: number, body: UpdateAppointmentDto): Promise<Appointment> {
    const data = {
      ...(body.date !== undefined ? { date: body.date } : {}),
      ...(body.patientId !== undefined ? { patientId: body.patientId } : {}),
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.userId !== undefined ? { userId: body.userId } : {}),
      ...(body.status !== undefined ? { status: body.status } : {}),
    };

    try {
      return await this.prisma.appointment.update({
        where: { id },
        data,
        select: appointMentSelect,
      });
    } catch (error) {
      this.prisma.handlePrismaWriteError(
        error,
        'Appointment',
        'An error occurred while updating the appointment',
      );
    }
  }

  async getByIdWithRelations(id: number): Promise<Appointment | null> {
    try {
      return this.prisma.appointment.findUnique({
        where: { id },
        select: {
          ...appointMentSelect,
          patient: {
            select: patientSelect,
          },
          user: {
            select: { ...userSelect, appointments: false },
          },
          billing: {
            select: billingSelect,
          },
        },
      });
    } catch (error) {
      this.prisma.handlePrismaWriteError(
        error,
        'Appointment',
        'An error occurred while fetching the appointment with relations',
      );
    }
  }
}
