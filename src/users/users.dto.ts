import { IsNotEmpty, IsEmail } from 'class-validator';
export namespace UsersDto {
  export class Create {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
  }

  export class Update {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
  }
}
