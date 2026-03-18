import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Patient, Prisma } from '@prisma/client';
import { UpdatePatientDto } from './dto/update-patient-dto';
import { BaseService } from '../class-library';

type CreatePatientInput = {
  name: string;
  email: string;
};

const patientSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.PatientSelect;

@Injectable()
export class PatientsService extends BaseService<
  Patient,
  CreatePatientInput,
  UpdatePatientDto
> {
  protected __baseServiceBrand: never;
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async getAll(): Promise<Patient[]> {
    try {
      return await this.prisma.patient.findMany({
        select: patientSelect,
      });
    } catch (error) {
      this.prisma.handlePrismaWriteError(
        error,
        'Patients',
        'An error occurred while fetching patients',
      );
    }
  }

  async getById(id: number): Promise<Patient | null> {
    try {
      return await this.prisma.patient.findUnique({
        where: { id },
        select: patientSelect,
      });
    } catch (error) {
      this.prisma.handlePrismaWriteError(
        error,
        'Patient',
        'An error occurred while fetching patient',
      );
    }
  }

  async create(body: CreatePatientInput): Promise<Patient> {
    try {
      return await this.prisma.patient.create({
        data: {
          name: body.name,
          email: body.email,
        },
        select: patientSelect,
      });
    } catch (error) {
      this.prisma.handlePrismaWriteError(
        error,
        'Patient',
        'An error occurred while creating patient',
      );
    }
  }

  async update(id: number, body: UpdatePatientDto): Promise<Patient> {
    const data = {
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.email !== undefined ? { email: body.email } : {}),
    };

    try {
      return await this.prisma.patient.update({
        where: { id },
        data,
        select: patientSelect,
      });
    } catch (error) {
      this.prisma.handlePrismaWriteError(
        error,
        'Patient',
        'An error occurred while updating patient',
      );
    }
  }

  delete(id: number): Promise<void> {
    return this.prisma.patient
      .delete({
        where: { id },
      })
      .then(() => {})
      .catch((error) => {
        this.prisma.handlePrismaWriteError(
          error,
          'Patient',
          'An error occurred while deleting patient',
        );
      });
  }
}
