import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { BillingsController } from './billings.controller';
import { BillingsService } from './billings.service';

@Module({
  imports: [PrismaModule],
  controllers: [BillingsController],
  providers: [BillingsService],
})
export class BillingsModule {}
