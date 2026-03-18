import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { EventLogsController } from './event-logs.controller';
import { EventLogsService } from './event-logs.service';

@Module({
  imports: [PrismaModule],
  controllers: [EventLogsController],
  providers: [EventLogsService],
})
export class EventLogsModule {}
