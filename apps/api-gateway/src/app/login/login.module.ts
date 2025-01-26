import { UsersModule } from '@jobie/users/nestjs';
import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
@Module({
  imports: [UsersModule],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
