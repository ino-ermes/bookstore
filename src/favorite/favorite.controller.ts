import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FavoriteService } from './favorite.service';
import { GetUser, RequestUser } from 'src/decorators/get-user.decorator';
import { DeleteFavoriteQuery } from './queries/delete-favorite.query';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Controller('favorites')
@UseGuards(AuthGuard)
export class FavoriteController {
  constructor(private favoriteService: FavoriteService) {}

  @Get()
  async getFavorites(@GetUser() user: RequestUser) {
    return this.favoriteService.findAllByUserId(user.id);
  }

  @Post()
  async createFavorite(
    @GetUser() user: RequestUser,
    @Body() data: CreateFavoriteDto,
  ) {
    return this.favoriteService.create(user.id, data.bookId);
  }

  @Delete()
  async deleteFavorite(
    @GetUser() user: RequestUser,
    @Query() data: DeleteFavoriteQuery,
  ) {
    return this.favoriteService.delete(user.id, data.bookId);
  }
}
