import { IsString, Length } from 'class-validator';

export class DeleteBookParam {
  @Length(24, 24)
  readonly id: string;
}
