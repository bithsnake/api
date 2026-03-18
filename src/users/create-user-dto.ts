/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateUserDto {
  @IsString() name!: string;
  @IsString() firstName!: string;
  @IsString() lastName!: string;
  @IsEmail() email!: string;
  @IsOptional() @IsInt() @Min(1) specializationId?: number;
}
