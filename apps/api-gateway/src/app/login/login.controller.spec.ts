import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { gatewayConfig } from '../../config/gateway.config';
import { LoginController } from './login.controller';
import { LoginModule } from './login.module';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [gatewayConfig] }),
        LoginModule,
      ],
    }).compile();
  });

  describe('isLoggedIn', () => {
    it('should throw because service is down', () => {
      const appController = app.get<LoginController>(LoginController);
      expect(appController.isLoggedIn()).rejects.toThrow();
    });
  });
});
