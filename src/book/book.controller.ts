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
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { GetBookParam } from './params/get-book.param';
import { UpdateBookParam } from './params/update-book.param';
import { DeleteBookParam } from './params/delete-book.param';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('books')
@UseGuards(AuthGuard, RolesGuard)
export class BookController {
  constructor(
    private bookService: BookService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  async getAllBooks(): Promise<Book[]> {
    return this.bookService.findAll();
  }

  @Roles(Role.Admin)
  @Post()
  @UseInterceptors(FileInterceptor('cover'))
  async createBook(
    @Body() book: CreateBookDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(image\/jpeg|image\/png)/ }),
        ],
        fileIsRequired: false,
      }),
    )
    cover?: Express.Multer.File,
  ): Promise<Book> {
    let coverUrl: string | undefined = undefined;
    if (cover) {
      const { url } = await this.cloudinaryService
        .uploadImage(cover)
        .catch(() => {
          throw new InternalServerErrorException();
        });
      coverUrl = url;
    }
    return this.bookService.create({ ...book, cover: coverUrl });
  }

  @Get(':id')
  async getBook(@Param() { id }: GetBookParam): Promise<Book> {
    return this.bookService.findById(id);
  }

  @Roles(Role.Admin)
  @Put(':id')
  @UseInterceptors(FileInterceptor('cover'))
  async updateBook(
    @Param() { id }: UpdateBookParam,
    @Body() book: UpdateBookDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(image\/jpeg|image\/png)/ }),
        ],
        fileIsRequired: false,
      }),
    )
    cover?: Express.Multer.File,
  ): Promise<Book> {
    let coverUrl: string | undefined = undefined;
    if (cover) {
      const { url } = await this.cloudinaryService
        .uploadImage(cover)
        .catch(() => {
          throw new InternalServerErrorException();
        });
      coverUrl = url;
    }

    return this.bookService.updateById(id, { ...book, cover: coverUrl });
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async deleteBook(@Param() { id }: DeleteBookParam) {
    return this.bookService.deleteById(id);
  }
}
