import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model } from 'mongoose';
import { randomUUID } from 'node:crypto';
import { CreateUserDto, User } from './users.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private model: Model<User>) {}

  async findAll(): Promise<User[]> {
    return this.model.find().exec();
  }

  async findById(id: string): Promise<User | undefined> {
    const user = await this.model.findById(id, { password: 0 }).exec();
    return user?.toObject();
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.model.findOne({ email }, { password: 0 }).exec();
    return user?.toObject();
  }

  async findPasswordByEmail(email: string) {
    const { password } =
      (await this.model.findOne({ email }, { password: 1 }).exec()) ?? {};
    return password;
  }

  async create(dto: CreateUserDto): Promise<User> {
    return new this.model(Object.assign(dto, { _id: randomUUID() })).save();
  }

  async refreshUserToken(id: string, refreshToken: string) {
    return this.model.updateOne({ _id: id }, { refreshToken }).exec();
  }

  async update(id: string, dto: Partial<User>): Promise<User | undefined> {
    return (
      (await this.model
        .findOneAndUpdate({ _id: id }, dto, { new: true })
        .exec()) ?? undefined
    );
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.model.deleteOne({ _id: id }).exec();
  }
}
