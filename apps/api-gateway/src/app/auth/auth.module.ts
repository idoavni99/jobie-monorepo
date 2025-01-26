import { UsersModule } from '@jobie/users/nestjs';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthMiddleware } from './middleware/auth.middleware';
@Module({
  imports: [JwtModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, AuthMiddleware],
  exports: [AuthMiddleware],
})
export class AuthModule {}
