import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Appointment, Prisma } from '@prisma/client';
import { CreateAppointmentDto } from './dto/create-appointment-dto';
import { BaseService } from '../class-library';
import { UpdateAppointmentDto } from './dto/update-appointment-dto';
import { patientSelect } from '../patients/patients.service';
import { userSelect } from '../users/users.service';
import { billingSelect } from '../billings/billings.service';
import { formatDateTime } from '../utils/date-utils';

export const appointMentSelect = {
  id: true,
  date: true,
  userId: true,
  user: {
    select: { name: true },
  },
  name: true,
  patientId: true,
  createdAt: true,
  updatedAt: true,
  reminders: {
    select: {
      createdAt: true,
    },
    take: 1,
    orderBy: { createdAt: 'desc' },
  },
  status: true,
  type: true,
} satisfies Prisma.AppointmentSelect;

type AppointmentRow = Prisma.AppointmentGetPayload<{
  select: typeof appointMentSelect;
}>;

type AppointmentFlattened = Omit<AppointmentRow, 'user'> & { userName: string };

type AppointmentWithLastRemindedAt = AppointmentFlattened & {
  lastRemindedAt: string | null;
};

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

  async getAll(): Promise<AppointmentWithLastRemindedAt[]> {
    try {
      const result = await this.prisma.appointment.findMany({
        select: appointMentSelect,
      });

      const appointments = result.map((appointment) => ({
        ...appointment,
        userName: appointment.user?.name ?? 'Unknown',
        lastRemindedAt: appointment.reminders[0]?.createdAt
          ? formatDateTime(appointment.reminders[0]?.createdAt)
          : null,
      }));

      return appointments;
    } catch (error) {
      this.prisma.handlePrismaWriteError(
        error,
        'Appointments',
        'An error occurred while fetching the appointments',
      );
    }
  }

  async getById(id: number): Promise<AppointmentFlattened | null> {
    try {
      const result = await this.prisma.appointment.findUnique({
        where: { id },
        select: appointMentSelect,
      });
      if (!result) return null;
      return {
        ...result,
        userName: result.user?.name ?? 'Unknown',
      };
    } catch (error) {
      this.prisma.handlePrismaWriteError(
        error,
        'Appointments',
        'An error occurred while fetching the appointment',
      );
    }
  }

  async create(body: CreateAppointmentDto): Promise<AppointmentFlattened> {
    const { date, patientId, name, userId: doctorId } = body;

    try {
      const result = await this.prisma.appointment.create({
        data: {
          date,
          status: 'SCHEDULED',
          type: 'CHECKUP',
          userId: doctorId,
          patientId,
          name:
            name ||
            `Appointment for patient ${patientId} with doctor ${doctorId}`,
        },
        select: appointMentSelect,
      });
      return {
        ...result,
        userName: result.user?.name ?? 'Unknown',
      };
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

  async update(
    id: number,
    body: UpdateAppointmentDto,
  ): Promise<AppointmentFlattened> {
    const data = {
      ...(body.date !== undefined ? { date: body.date } : {}),
      ...(body.patientId !== undefined ? { patientId: body.patientId } : {}),
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.userId !== undefined ? { userId: body.userId } : {}),
      ...(body.status !== undefined ? { status: body.status } : {}),
    };

    try {
      const result = await this.prisma.appointment.update({
        where: { id },
        data,
        select: appointMentSelect,
      });
      return {
        ...result,
        userName: result.user?.name ?? 'Unknown',
      };
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
