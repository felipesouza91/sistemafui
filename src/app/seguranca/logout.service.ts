import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { AuthService } from './auth.service';

import { HttpClient } from '@angular/common/http';

@Injectable()
export class LogoutService {
  constructor(private auth: AuthService) {}

  logout() {
    return this.auth.logout();
  }
}
