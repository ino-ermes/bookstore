import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 16)
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 16)
  readonly newPassword: string;
}
