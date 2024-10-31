import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { Role } from 'src/auth/enums/role.enum';

export class UpdateUserDto {
  @IsString()
  @Length(1, 16)
  readonly name?: string;

  @IsNotEmpty()
  @IsEnum(Role)
  readonly role: Role;
}
