import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { Role } from './enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(data: SignUpDto): Promise<{
    user: {
      _id: mongoose.Types.ObjectId;
      username: string;
      email: string;
      roles: Role[];
    };
    accessToken: string;
  }> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    try {
      const user = await this.userModel.create({
        ...data,
        password: hashedPassword,
      });

      const payload = {
        id: user._id,
        roles: user.roles,
      };

      const accessToken = await this.jwtService.signAsync(payload);

      return {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          roles: user.roles,
        },
        accessToken,
      };
    } catch {
      throw new BadRequestException('Email or Username is already exist');
    }
  }

  async signIn(data: SignInDto): Promise<{
    user: {
      _id: mongoose.Types.ObjectId;
      username: string;
      email: string;
      roles: Role[];
    };
    accessToken: string;
  }> {
    const user = await this.userModel.findOne({ email: data.email });
    if (!user) {
      throw new UnauthorizedException('Email is not exist');
    }

    const isCorrectPassword = await bcrypt.compare(
      data.password,
      user.password,
    );

    if (!isCorrectPassword) {
      throw new UnauthorizedException('Password is incorrect');
    }

    const payload = {
      id: user._id,
      roles: user.roles,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        roles: user.roles,
      },
      accessToken,
    };
  }
}
