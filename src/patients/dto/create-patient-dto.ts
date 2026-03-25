import { IsEmail, IsString } from 'class-validator';

export class CreatePatientDto {
  @IsString() name!: string;
  @IsEmail() email!: string;
}
