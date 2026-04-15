import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWaitlistRequestBodyDTOV1 {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  full_name: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  status: string;

  @IsString()
  @IsOptional()
  note?: string;
}
