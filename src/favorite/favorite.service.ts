import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Favorite } from './schemas/favorite.schema';
import mongoose from 'mongoose';
import { Book } from 'src/book/schemas/book.schema';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectModel(Favorite.name)
    private favoriteModel: mongoose.Model<Favorite>,
    @InjectModel(Book.name)
    private bookModel: mongoose.Model<Book>,
  ) {}

  async findAllByUserId(userId: string) {
    const favorites = await this.favoriteModel
      .find({ user: userId })
      .populate('book')
      .select('book');

    return favorites.map((favorite) => favorite.book);
  }

  async create(userId: string, bookId: string) {
    const bookExists = await this.bookModel.exists({ _id: bookId });

    if (!bookExists) {
      throw new BadRequestException('Book not found');
    }

    const favorite = await this.favoriteModel.create({
      user: userId,
      book: bookId,
    });

    return favorite;
  }

  async delete(userId: string, bookId: string) {
    const favorite = this.favoriteModel.findOneAndDelete({
      user: userId,
      book: bookId,
    });

    if (!favorite) {
      throw new NotFoundException();
    }

    return favorite;
  }
}
