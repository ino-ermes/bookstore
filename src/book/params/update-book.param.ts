import { IsString, Length } from 'class-validator';

export class UpdateBookParam {
  @Length(24, 24)
  readonly id: string;
}
