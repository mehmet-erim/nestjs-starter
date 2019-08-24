import { IsNotEmpty, IsEmail } from 'class-validator';

export namespace AuthDto {
  export class Login {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
  }

  export class Register extends Login {
    @IsNotEmpty()
    name: string;
  }

  export interface JwtPayload {
    email: string;
  }
}
