import { IsString, Length } from 'class-validator';

export class DeleteBookParams {
  @Length(24, 24)
  readonly id: string;
}
