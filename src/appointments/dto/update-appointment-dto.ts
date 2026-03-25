import { $Enums } from '@prisma/client';
import { IsInt, IsString, IsDate, IsEnum } from 'class-validator';

export class UpdateAppointmentDto {
  @IsInt() id?: number;
  @IsInt() patientId?: number;
  @IsInt() userId?: number;
  @IsString() name?: string;
  @IsDate() date?: Date;
  @IsDate() createdAt?: Date;
  @IsDate() updatedAt?: Date;
  @IsEnum($Enums.AppointmentStatus) status?: $Enums.AppointmentStatus;
}
