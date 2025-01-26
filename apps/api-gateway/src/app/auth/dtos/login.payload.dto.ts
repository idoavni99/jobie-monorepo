import { UserDto } from '@jobie/users/nestjs';
import { PickType } from '@nestjs/swagger';

export class LoginPayloadDto extends PickType(UserDto, [
  'username',
  'password',
]) {}
