import { IsString, Length } from 'class-validator';

export class UpdateBookParams {
  @Length(24, 24)
  readonly id: string;
}
