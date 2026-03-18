import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBillingDto {
  @IsInt() appointmentId: number;
  @IsNumber() amount: number;
  @IsOptional() @IsString() description?: string;
}
