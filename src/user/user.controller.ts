import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  InternalServerErrorException,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './dto/create-user.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Admin)
export class UserController {
  constructor(
    private userService: UserService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  async createUser(
    @Body() user: CreateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000 }),
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

    return this.userService.create({ ...user, avatar: avatarUrl });
  }

  @Post(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateUser(
    @Param('id') id: string,
    @Body() user: CreateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000 }),
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

    return this.userService.updateById(id, { ...user, avatar: avatarUrl });
  }

  @Get()
  async getAllUser() {
    return this.userService.findAll();
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteById(id);
  }
}
