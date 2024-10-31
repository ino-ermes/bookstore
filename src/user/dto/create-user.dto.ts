import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { Role } from 'src/auth/enums/role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 16)
  readonly username: string;

  @IsString()
  @Length(1, 16)
  readonly name?: string;

  @IsNotEmpty()
  @IsEnum(Role)
  readonly role: Role;
}
