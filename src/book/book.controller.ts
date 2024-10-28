import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
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

@Controller('books')
@UseGuards(AuthGuard, RolesGuard)
export class BookController {
  constructor(private bookService: BookService) {}

  @Roles(Role.User)
  @Get()
  async getAllBooks(): Promise<Book[]> {
    return this.bookService.findAll();
  }

  @Post()
  async createBook(@Body() book: CreateBookDto): Promise<Book> {
    console.log(book);
    return this.bookService.create(book);
  }

  @Get(':id')
  async getBook(@Param() { id }: GetBookParam): Promise<Book> {
    return this.bookService.findById(id);
  }

  @Put(':id')
  async updateBook(
    @Param() { id }: UpdateBookParam,
    @Body() book: UpdateBookDto,
  ): Promise<Book> {
    return this.bookService.updateById(id, book);
  }

  @Delete(':id')
  async deleteBook(@Param() { id }: DeleteBookParam) {
    return this.bookService.deleteById(id);
  }
}
