import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class AdminLoginRequestBodyDTOV1 {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  password: string;
}
