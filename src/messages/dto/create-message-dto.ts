import { IsInt, IsString, Min } from 'class-validator';

export class CreateMessageDto {
  @IsInt()
  @Min(1)
  appointmentId!: number;

  @IsInt()
  @Min(1)
  patientId!: number;

  @IsString()
  message!: string;
}
