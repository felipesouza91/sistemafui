import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

export interface UsuarioLogin {
  login: string;
  senha: string;
}

@Injectable()
export class AuthService {
  authUrl: string;
  jwtPayload: any;
  oauthAuthorizeUrl: string;
  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {
    this.authUrl = `${environment.apiUrl}/oauth2/token`;
    this.oauthAuthorizeUrl = `${environment.apiUrl}/oauth2/authorize`;
    this.carregarToken();
  }

  login() {
    const response_type = 'code';
    const client_id = 'angular';
    const state = 'abc';
    const redirect_uri = 'http://127.0.0.1:4200';
    const scope = 'READ WRITE';
    const code_challange = 'bKE9UspwyIPg8LsQHkJaiehiTeUdstI5JZOvaoQRgJA';
    const code_challange_method = 'S256';
    const authorizeUri = encodeURI(
      `${this.oauthAuthorizeUrl}?response_type=${response_type}&client_id=${client_id}&state=${state}&redirect_uri=${redirect_uri}&scope=${scope}&code_challange=${code_challange}&code_challange_method=${code_challange_method}`
    );
    window.location.href = authorizeUri;
  }

  isAccessTokenInvalid() {
    const token = localStorage.getItem('token');
    return !token || this.jwtHelper.isTokenExpired(token);
  }

  obterNovoAccessToken(): Promise<void> {
    let headers = new HttpHeaders();
    headers = headers.append(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );
    headers = headers.append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==');
    const body = 'grant_type=refresh_token';

    return this.http
      .post(this.authUrl, body, { headers, withCredentials: true })
      .toPromise()
      .then((resp: any) => {
        this.armazenarToken(resp.access_token);
        return Promise.resolve();
      })
      .catch((erro) => {
        console.log('Erro ao renovar token.', erro);
        return Promise.resolve();
      });
  }

  limparAccessToken() {
    localStorage.removeItem('token');
    this.jwtPayload = null;
  }

  temPermissao(permisao: string) {
    return this.jwtPayload && this.jwtPayload.authorities.includes(permisao);
  }

  getUsername() {
    return this.jwtPayload && this.jwtPayload.nome;
  }

  temQualquerPermissao(roles: string[]) {
    for (const role of roles) {
      if (this.temPermissao(role)) {
        return true;
      }
    }
    return false;
  }

  private armazenarToken(token: string) {
    this.jwtPayload = this.jwtHelper.decodeToken(token);
    localStorage.setItem('token', token);
  }

  private carregarToken() {
    const token = localStorage.getItem('token');
    if (token) {
      this.armazenarToken(token);
    }
  }
}
