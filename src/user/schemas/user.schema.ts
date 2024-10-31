import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from 'src/auth/enums/role.enum';

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop()
  name?: string;

  @Prop()
  avatar?: string;

  @Prop({
    enum: Role,
    default: Role.User,
    required: true,
  })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
