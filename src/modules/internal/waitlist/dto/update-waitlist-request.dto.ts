import { IsOptional, IsString } from 'class-validator';

export class UpdateWaitlistRequestBodyDTOV1 {
  @IsString()
  @IsOptional()
  full_name?: string;

  @IsString()
  @IsOptional()
  phone_number?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  note?: string;
}
