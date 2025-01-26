import { CreateUserDto } from '@jobie/users/nestjs';
import { PickType } from '@nestjs/swagger';
export class LoginPayloadDto extends PickType(CreateUserDto, [
  'username',
  'password',
]) {}
