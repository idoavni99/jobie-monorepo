import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LoginService {
  constructor(private readonly httpService: HttpService) {}
  isLoggedIn() {
    return this.httpService.axiosRef.get('/isLoggedIn');
  }

  logout() {
    return this.httpService.axiosRef.post('/logout');
  }

  login(username: string, password: string) {
    return this.httpService.axiosRef.post('/login', { username, password });
  }
}
