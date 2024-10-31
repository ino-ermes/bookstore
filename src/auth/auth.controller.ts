import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { AuthService } from './auth.service';
import mongoose from 'mongoose';
import { SignUpDto } from './dto/sign-up.dto';
import { Role } from './enums/role.enum';
import { GetUser, RequestUser } from 'src/decorators/get-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() data: SignInDto): Promise<{
    user: {
      _id: mongoose.Types.ObjectId;
      username: string;
      email: string;
      role: Role;
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
      role: Role;
    };
    accessToken: string;
  }> {
    return this.authService.signUp(data);
  }

  @UseGuards(AuthGuard)
  @Get('info')
  async getUser(@GetUser() reqUser: RequestUser) {
    return this.authService.findById(reqUser.id);
  }

  @UseGuards(AuthGuard)
  @Post('info')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateUser(
    @GetUser() reqUser: RequestUser,
    @Body() user: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(image\/jpeg|image\/png)/ }),
        ],
        fileIsRequired: false,
      }),
    )
    avatar?: Express.Multer.File,
  ) {
    let avatarUrl: string | undefined = undefined;
    if (avatar) {
      const { url } = await this.cloudinaryService
        .uploadImage(avatar)
        .catch(() => {
          throw new InternalServerErrorException();
        });
      avatarUrl = url;
    }

    return this.authService.updateById(reqUser.id, {
      ...user,
      avatar: avatarUrl,
    });
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  async changePassword(
    @GetUser() reqUser: RequestUser,
    @Body() data: ChangePasswordDto,
  ) {
    return this.authService.changePasswordById(reqUser.id, data);
  }
}
