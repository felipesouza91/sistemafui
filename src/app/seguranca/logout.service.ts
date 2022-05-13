import {environment} from './../../environments/environment';
import {AuthService} from './auth.service';

import {Injectable} from '@angular/core';
import {SistemFHttp} from './sistemaf-http';

@Injectable()
export class LogoutService {
  tokenRevokeUrl: string;

  constructor(private http: SistemFHttp, private auth: AuthService) {
    this.tokenRevokeUrl = `${environment.apiUrl}/tokens/revoke`;
  }

  logout() {
    return this.http
      .delete(this.tokenRevokeUrl, {withCredentials: true})
      .toPromise()
      .then(() => {
        this.auth.limparAccessToken();
      });
  }
}
