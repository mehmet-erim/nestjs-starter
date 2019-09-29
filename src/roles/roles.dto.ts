import { IsNotEmpty, IsEmail } from 'class-validator';

export namespace RolesDto {
  export class Create {
    @IsNotEmpty()
    name: string;
  }

  export class Update {
    @IsNotEmpty()
    name: string;
  }
}
