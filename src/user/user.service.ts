import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './schemas/user.schema';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

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

  async create(user: User) {
    const res = await this.userModel.create(user);

    return res;
  }

  async updateById(id: string, user: User) {
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
}
