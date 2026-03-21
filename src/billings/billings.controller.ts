import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { Billing } from '@prisma/client';
import { BaseController } from '../class-library';
import { CreateBillingDto } from './dto/create-billing-dto';
import { UpdateBillingDto } from './dto/update-billing-dto';
import { BillingsService } from './billings.service';

@Controller('billings')
export class BillingsController extends BaseController<
  Billing,
  CreateBillingDto,
  UpdateBillingDto,
  BillingsService
> {
  constructor(private readonly billingsService: BillingsService) {
    super(billingsService);
  }

  @Get(':id/details')
  async getDetails(@Param('id', ParseIntPipe) id: number): Promise<Billing> {
    return this.billingsService.getById(id);
  }
}
