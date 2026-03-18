import { IsInt, IsString, Min } from 'class-validator';

export class CreateReminderDto {
  @IsInt()
  @Min(1)
  appointmentId!: number;

  @IsString()
  message!: string;
}
