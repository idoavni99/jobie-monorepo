import { DataEntity } from '@jobie/data-entities-core';
import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import { TUser } from '../types/user.type';

export type UserDocument = HydratedDocument<User>;
export type UserEntity = TUser & DataEntity;
@Schema()
export class User implements UserEntity {
  @Prop()
  _createdAt: Date;

  @Prop()
  _updatedAt: Date;

  @Prop()
  @Expose()
  _id: string;

  @Prop()
  @MinLength(6)
  password: string;

  @Prop()
  @Expose()
  fullName: string;

  @Virtual({
    get: function (this: User) {
      return this.fullName.split(' ').shift();
    },
  })
  firstName: string;

  @Virtual({
    get: function (this: User) {
      return this.fullName.split(' ').pop();
    },
  })
  lastName: string;

  @Prop()
  email: string;
}

export class CreateUserDto extends OmitType(User, [
  '_id',
  'firstName',
  'lastName',
  '_createdAt',
  '_updatedAt',
]) {
  @ApiProperty({
    name: 'password',
    type: String,
    minLength: 6,
  })
  @Expose()
  @IsString()
  @MinLength(6)
  override password: string;

  @ApiProperty({
    name: 'email',
    type: String,
  })
  @Expose()
  @IsEmail()
  override email: string;

  @ApiProperty({
    name: 'fullName',
    type: String,
  })
  @IsString()
  @Expose()
  override fullName: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
