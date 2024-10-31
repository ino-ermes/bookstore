import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteFavoriteQuery {
  @IsNotEmpty()
  @IsString()
  readonly bookId: string;
}
