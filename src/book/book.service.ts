import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schemas/book.schema';
import mongoose from 'mongoose';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: mongoose.Model<Book>,
  ) {}

  async findAll(): Promise<Book[]> {
    const books = await this.bookModel.find().select('-description');

    return books;
  }

  async create(book: Book): Promise<Book> {
    const res = await this.bookModel.create(book);

    return res;
  }

  async findById(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  async updateById(id: string, book: Book): Promise<Book> {
    const res = await this.bookModel.findByIdAndUpdate(id, book, {
      new: true,
      runValidators: true,
    });

    if (!res) {
      throw new NotFoundException('Book not found');
    }

    return res;
  }

  async deleteById(id: string): Promise<Book> {
    const book = await this.bookModel.findByIdAndDelete(id);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }
}
