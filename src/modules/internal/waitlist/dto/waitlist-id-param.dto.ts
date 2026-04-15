import { IsDefined, IsMongoId, IsNotEmpty } from 'class-validator';

export class WaitlistIdRequestParamDTOV1 {
  @IsMongoId()
  @IsNotEmpty()
  @IsDefined()
  id: string;
}
