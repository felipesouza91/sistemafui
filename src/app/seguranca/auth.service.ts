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

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {
    this.authUrl = `${environment.apiUrl}/oauth/token`;
    this.carregarToken();
  }

  login(usuario: UsuarioLogin): Promise<void> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==');
    headers = headers.append(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );
    const body = `username=${usuario.login}&password=${usuario.senha}&grant_type=password`;
    return this.http
      .post(this.authUrl, body, { headers, withCredentials: true })
      .toPromise()
      .then((resp: any) => {
        this.armazenarToken(resp.access_token);
      })
      .catch((resp) => {
        if (resp.status === 400) {
          const respJson = resp;
          if (respJson.error.error === 'invalid_grant') {
            return Promise.reject('Usuário ou senha incorreto');
          }
        }
        return Promise.reject(resp);
      });
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
        return Promise.resolve(null);
      })
      .catch((erro) => {
        console.log('Erro ao renovar token.', erro);
        return Promise.resolve(null);
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

  temQualquerPermissao(roles) {
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
