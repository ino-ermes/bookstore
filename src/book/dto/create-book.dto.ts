import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { Category } from '../schemas/book.schema';
import { Transform } from 'class-transformer';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 1024)
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 128)
  readonly author: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 2048)
  readonly description: string;

  @IsNotEmpty()
  @Min(0)
  @Max(100)
  @Transform(({ value }) => parseFloat(value))
  readonly price: number;

  @IsNotEmpty()
  @IsEnum(Category)
  readonly category: Category;
}
