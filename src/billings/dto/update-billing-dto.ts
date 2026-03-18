import { IsOptional, IsInt, IsNumber, IsString } from 'class-validator';

export class UpdateBillingDto {
  @IsOptional() @IsInt() appointmentId?: number;
  @IsOptional() @IsNumber() amount?: number;
  @IsOptional() @IsString() description?: string;
}
