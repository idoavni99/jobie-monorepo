import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { ConfigType } from '@nestjs/config';
import { gatewayConfig } from '../../config/gateway.config';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: (config: ConfigType<typeof gatewayConfig>) => {
        return {
          baseURL:
            config.serviceDiscovery['registration-service'] ??
            'http://localhost:3001',
          timeout: 5000,
          maxRedirects: 5,
        };
      },
      inject: [gatewayConfig.KEY],
    }),
  ],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
