import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { PatientsModule } from './patients/patients.module';
import { RemindersModule } from './reminders/reminders.module';
import { EventLogsModule } from './eventLogs/event-logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    UsersModule,
    AppointmentsModule,
    PatientsModule,
    RemindersModule,
    EventLogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
