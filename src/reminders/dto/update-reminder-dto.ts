import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateReminderDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  appointmentId?: number;

  @IsOptional()
  @IsString()
  message?: string;
}
