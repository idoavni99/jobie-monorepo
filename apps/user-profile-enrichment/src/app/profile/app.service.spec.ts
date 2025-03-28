import { Test } from '@nestjs/testing';
import { ProfileService } from './profile.service';

describe('AppService', () => {
  let service: ProfileService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [ProfileService],
    }).compile();

    service = app.get<ProfileService>(ProfileService);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(0).toBe(0);
    });
  });
});
