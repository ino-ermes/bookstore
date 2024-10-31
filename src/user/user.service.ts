import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './schemas/user.schema';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Role } from 'src/auth/enums/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
  ) {}

  async findAll() {
    const users = await this.userModel.find();
    return users;
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(user: CreateUserDto & { avatar?: string }) {
    const res = await this.userModel.create(user);

    return res;
  }

  async updateById(id: string, user: UpdateUserDto & { avatar?: string }) {
    const res = await this.userModel.findByIdAndUpdate(id, user, {
      new: true,
      runValidators: true,
    });

    if (!res) {
      throw new NotFoundException('User not found');
    }

    return res;
  }

  async deleteById(id: string) {
    const res = await this.userModel.findByIdAndDelete(id);

    if (!res) {
      throw new NotFoundException('User not found');
    }

    return res;
  }

  async updatePasswordById(id: string, data: UpdatePasswordDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const res = await this.userModel.findByIdAndUpdate(
      id,
      {
        password: hashedPassword,
      },
      { new: true, runValidators: true },
    );

    if (!res) {
      throw new NotFoundException('User not found');
    }

    return res;
  }

  async getUserRoleById(id: string) {
    const { role } = await this.userModel.findById(id).select('role');

    return role;
  }
}
