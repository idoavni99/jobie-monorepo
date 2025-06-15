import { UsersModule } from '@jobie/users/nestjs';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './google/google-auth.guard';
import { GoogleAuthStrategy } from './google/google-auth.strategy';
import { AuthMiddleware } from './middleware/auth.middleware';
@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, AuthMiddleware, GoogleAuthStrategy, GoogleAuthGuard],
  exports: [AuthMiddleware, GoogleAuthGuard],
})
export class AuthModule {}
