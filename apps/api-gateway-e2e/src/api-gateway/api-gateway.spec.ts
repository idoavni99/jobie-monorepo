import { HttpStatus } from '@nestjs/common';
import axios, { AxiosError } from 'axios';

describe('GET /isLoggedIn', () => {
  it('should throw', async () => {
    try {
      await axios.get(`/isLoggedIn`);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        expect(error.status).toEqual(HttpStatus.UNAUTHORIZED);
      }
    }
  });
});
