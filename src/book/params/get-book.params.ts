import { IsString, Length } from 'class-validator';

export class GetBookParams {
  @Length(24, 24)
  readonly id: string;
}
