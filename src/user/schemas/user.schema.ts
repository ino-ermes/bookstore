import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from 'src/auth/enums/role.enum';

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  name?: string;

  @Prop()
  avatar?: string;

  @Prop({
    type: [{ type: String, enum: Role }],
    default: [Role.User],
    required: true,
  })
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
