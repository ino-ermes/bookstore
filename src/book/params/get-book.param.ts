import { Length } from 'class-validator';

export class GetBookParam {
  @Length(24, 24)
  readonly id: string;
}
