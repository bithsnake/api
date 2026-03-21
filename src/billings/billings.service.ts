import { Injectable } from '@nestjs/common';
import { BaseService } from '../class-library';
import { UpdateBillingDto } from './dto/update-billing-dto';
import { CreateBillingDto } from './dto/create-billing-dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Billing, Prisma } from '@prisma/client';

export const billingSelect = {
  id: true,
  appointmentId: true,
  amount: true,
  status: true,
  description: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.BillingSelect;

@Injectable()
export class BillingsService extends BaseService<
  Billing,
  CreateBillingDto,
  UpdateBillingDto
> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(body: CreateBillingDto): Promise<Billing> {
    try {
      return this.prisma.billing.create({
        data: {
          appointmentId: body.appointmentId,
          amount: body.amount,
          description: body.description,
        },
        select: billingSelect,
      });
    } catch (error) {
      this.prisma.handlePrismaWriteError(
        error,
        'Billing',
        'An error occurred while creating the billing',
      );
    }
  }
  async getById(id: number): Promise<Billing> {
    try {
      return this.prisma.billing.findUnique({
        where: { id },
        select: billingSelect,
      });
    } catch (error) {
      this.prisma.handlePrismaWriteError(
        error,
        'Billing',
        'An error occurred while retrieving the billing',
      );
    }
  }
  async getAll(): Promise<Billing[]> {
    try {
      return this.prisma.billing.findMany({
        select: billingSelect,
      });
    } catch (error) {
      this.prisma.handlePrismaWriteError(
        error,
        'Billing',
        'An error occurred while retrieving all billings',
      );
    }
  }
  async update(id: number, body: UpdateBillingDto): Promise<Billing> {
    const data: Prisma.BillingUpdateInput = {
      appointment: body?.appointmentId
        ? { connect: { id: body.appointmentId } }
        : undefined,
      amount: body?.amount ? body.amount : undefined,
      description:
        body?.description !== undefined ? body.description : undefined,
    };
    try {
      return this.prisma.billing.update({
        where: { id },
        data,
        select: billingSelect,
      });
    } catch (error) {
      this.prisma.handlePrismaWriteError(
        error,
        'Billing',
        'An error occurred while updating the billing',
      );
    }
  }
  async delete(id: number): Promise<void> {
    try {
      await this.prisma.billing.update({
        where: { id },
        data: { status: 'DELETED' },
      });
    } catch (error) {
      this.prisma.handlePrismaWriteError(
        error,
        'Billing',
        'An error occurred while deleting the billing',
      );
    }
  }
}
