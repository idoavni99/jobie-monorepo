import { DataEntity, defaultSchemaOptions } from '@jobie/data-entities-core';
import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import { TUser } from '../types/user.type';

export type UserDocument = HydratedDocument<User>;
export type UserEntity = TUser & DataEntity;
@Schema(defaultSchemaOptions)
export class User implements UserEntity {
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  _id: string;

  @Prop()
  password: string;

  @Prop()
  fullName: string;

  @Virtual({
    get: function (this: User) {
      return Boolean(
        this.goalJob &&
          this.education &&
          this.location &&
          this.bio &&
          this.linkedinProfileUrl &&
          this.aspirationalLinkedinUrl
      );
    },
  })
  isProfileSetUp: boolean;

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

  @Prop({ unique: true })
  email: string;

  @Prop({ unique: true })
  linkedinProfileUrl?: string;

  @Prop()
  aspirationalLinkedinUrl?: string;

  @Prop()
  goalJob?: string;

  @Prop()
  location?: string;

  @Prop()
  education?: string;

  @Prop()
  bio?: string;

  @Prop({ type: [String], default: [] })
  skills?: string[];

  @Prop({
    type: [
      {
        title: String,
        companyName: String,
      },
    ],
    default: [],
  })
  experienceSummary?: {
    title: string;
    companyName: string;
  }[];

  @Prop()
  linkedinHeadline?: string;
}

export class CreateUserDto {
  @ApiProperty({
    name: 'password',
    type: String,
    minLength: 6,
  })
  @Expose()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    name: 'email',
    type: String,
  })
  @Expose()
  @IsEmail()
  email: string;

  @ApiProperty({
    name: 'fullName',
    type: String,
  })
  @IsString()
  @Expose()
  fullName: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
