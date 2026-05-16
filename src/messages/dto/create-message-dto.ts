import { IsInt, IsString, Min } from 'class-validator';

export class CreateMessageDto {
  @IsInt()
  @Min(1)
  appointmentId!: number;

  @IsString()
  message!: string;
}
