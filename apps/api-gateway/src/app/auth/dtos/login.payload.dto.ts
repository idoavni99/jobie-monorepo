import { User } from '@jobie/users/nestjs';
import { PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
export class LoginPayloadDto extends PickType(User, ['password', 'email']) {
  @IsEmail()
  @Expose()
  override email: string;

  @IsString()
  @Expose()
  override password: string;
}
