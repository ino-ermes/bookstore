import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { Role } from 'src/auth/enums/role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 16)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 16)
  password: string;

  @IsString()
  @Length(1, 16)
  name?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Role, { each: true })
  roles: Role[];
}
