import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { AuthService } from './auth.service';
import mongoose from 'mongoose';
import { SignUpDto } from './dto/sign-up.dto';
import { Role } from './enums/role.enum';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() data: SignInDto): Promise<{
    user: {
      _id: mongoose.Types.ObjectId;
      username: string;
      email: string;
      roles: Role[];
    };
    accessToken: string;
  }> {
    return this.authService.signIn(data);
  }

  @Post('sign-up')
  async signUp(@Body() data: SignUpDto): Promise<{
    user: {
      _id: mongoose.Types.ObjectId;
      username: string;
      email: string;
      roles: Role[];
    };
    accessToken: string;
  }> {
    return this.authService.signUp(data);
  }
}
