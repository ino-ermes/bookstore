import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { GetBookParams } from './params/get-book.params';
import { UpdateBookParams } from './params/update-book.params';
import { DeleteBookParams } from './params/delete-book.params';

@Controller('books')
export class BookController {
  constructor(private bookService: BookService) {}

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
  async getBook(@Param() { id }: GetBookParams): Promise<Book> {
    return this.bookService.findById(id);
  }

  @Put(':id')
  async updateBook(
    @Param() { id }: UpdateBookParams,
    @Body() book: UpdateBookDto,
  ): Promise<Book> {
    return this.bookService.updateById(id, book);
  }

  @Delete(':id')
  async deleteBook(@Param() { id }: DeleteBookParams) {
    return this.bookService.deleteById(id);
  }
}
