import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 16)
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 16)
  readonly password: string;
}
