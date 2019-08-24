import { IsNotEmpty, IsUUID } from 'class-validator';

export namespace CommonValidators {
  export class IdParamValidator {
    @IsNotEmpty()
    @IsUUID()
    id: string;
  }
}
