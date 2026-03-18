/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsInt, IsString, IsDate } from 'class-validator';

export class UpdateAppointmentDto {
  @IsInt() id?: number;
  @IsString() name?: string;
  @IsDate() date?: Date;
  @IsDate() createdAt?: Date;
  @IsDate() updatedAt?: Date;
  @IsInt() patientId?: number;
  @IsInt() userId?: number;
}
