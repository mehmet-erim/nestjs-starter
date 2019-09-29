import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  ValidateNested,
  IsArray,
  IsDefined,
} from 'class-validator';
import { Type } from 'class-transformer';

export namespace UsersDto {
  export class Create {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Role)
    roles?: Role[];
  }

  export class Update {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
  }

  export class Role {
    @IsNotEmpty()
    @IsUUID()
    id: string;
  }
}
