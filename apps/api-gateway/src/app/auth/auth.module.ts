import { UsersModule } from '@jobie/users/nestjs';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthMiddleware } from './middleware/auth.middleware';
@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, AuthMiddleware],
  exports: [AuthMiddleware],
})
export class AuthModule {}
