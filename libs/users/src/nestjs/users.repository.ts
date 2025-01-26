import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'node:crypto';
import { DeleteResult, Model } from 'mongoose';
import { User, UserDto } from './users.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private model: Model<User>) {}

  async findAll(): Promise<User[]> {
    return this.model.find().exec();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.model.findOne({ username }).exec();
  }

  async create(dto: UserDto): Promise<User> {
    return new this.model(Object.assign(dto, { _id: randomUUID() })).save();
  }

  async refreshUserToken(id: string, refreshToken: string) {
    return this.model.updateOne({ _id: id }, { refreshToken }).exec();
  }

  async update(id: string, dto: UserDto): Promise<User | null> {
    return this.model.findOneAndUpdate({ _id: id }, dto, { new: true }).exec();
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.model.deleteOne({ _id: id }).exec();
  }
}
