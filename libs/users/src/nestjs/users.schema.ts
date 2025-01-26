import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import { TUser } from '../types/user.type';

export type UserDocument = HydratedDocument<User>;
@Schema()
export class User implements TUser {
  @Prop()
  @ApiProperty({ type: String, name: '_id' })
  @Expose()
  _id: string;

  @Prop()
  @ApiProperty({
    type: String,
    name: 'username',
    example: 'avni',
    required: true,
  })
  @IsNotEmpty()
  @Expose()
  username: string;

  @Prop()
  @ApiProperty({
    type: String,
    name: 'password',
    example: 'Aa515151',
    minLength: 6,
  })
  @MinLength(6)
  password: string;

  @Prop()
  @ApiProperty({ type: String, name: 'fullName', required: true })
  @IsNotEmpty()
  @Expose()
  fullName: string;

  @Virtual({
    get: function (this: User) {
      return this.fullName.split(' ').shift();
    },
  })
  @Expose()
  firstName: string;

  @Virtual({
    get: function (this: User) {
      return this.fullName.split(' ').pop();
    },
  })
  @Expose()
  lastName: string;

  @Prop()
  @ApiProperty({
    type: String,
    name: 'email',
    required: true,
    example: 'savyon@gmail.com',
  })
  @IsEmail()
  @Expose()
  email: string;
}

export class CreateUserDto extends OmitType(User, ['_id']) {
  @Expose()
  override password: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
