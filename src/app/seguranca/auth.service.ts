import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

export interface UsuarioLogin {
  login: string;
  senha: string;
}

@Injectable()
export class AuthService {
  authUrl: string;
  jwtPayload: any;
  _oauthAuthorizeUrl: string;
  _basicCredentials: string;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router
  ) {
    this.authUrl = `${environment.apiUrl}/oauth2/token`;
    this._oauthAuthorizeUrl = `${environment.apiUrl}/oauth2/authorize`;
    this._basicCredentials = `Basic ${environment.clientSecret}`;
    this.carregarToken();
  }

  login() {
    const response_type = 'code';
    const client_id = 'angular';
    const state = this.gerarStringAleatoria(40);
    const codeVerifier = this.gerarStringAleatoria(128);
    localStorage.setItem('state', state);
    localStorage.setItem('codeVerifier', codeVerifier);

    const scope = 'READ WRITE';
    const code_challange = CryptoJS.SHA256(codeVerifier)
      .toString(CryptoJS.enc.Base64)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    const code_challange_method = 'S256';
    const authorizeUri = encodeURI(
      `${this._oauthAuthorizeUrl}?response_type=${response_type}&client_id=${client_id}&state=${state}&redirect_uri=${environment.oauthCallbackUrl}&scope=${scope}&code_challange=${code_challange}&code_challange_method=${code_challange_method}`
    );
    window.location.href = authorizeUri;
  }

  isAccessTokenInvalid() {
    const token = localStorage.getItem('token');
    return !token || this.jwtHelper.isTokenExpired(token);
  }

  getAccessTokenWithRefreshToken(): Promise<void> {
    let headers = new HttpHeaders();
    headers = headers
      .append('Content-Type', 'application/x-www-form-urlencoded')
      .append('Authorization', this._basicCredentials);

    const payload = new HttpParams()
      .append('grant_type', 'refresh_token')
      .append('refresh_token', localStorage.getItem('refresh_token')!);

    return firstValueFrom(
      this.http.post(this.authUrl, payload, { headers })
    )
      .then((response: any) => {
        this.armazenarToken(response.access_token);
        this.armazenaRefreshToken(response.refresh_token);
        return Promise.resolve();
      })
      .catch((response) => {
        console.error('Erro ao gerar o token com o code.', response);
        return Promise.resolve();
      });
  }

  getAccessTokeWithToken(code: string, state: string) {
    const localState = localStorage.getItem('state');
    if (state !== localState) {
      this.router.navigate(['/']);
    }
    const codeVerifier = localStorage.getItem('codeVerifier')!;
    let headers = new HttpHeaders()
      .append('Authorization', this._basicCredentials)
      .append('Content-Type', 'application/x-www-form-urlencoded');
    const params = new HttpParams()
      .append('grant_type', 'authorization_code')
      .append('code', code)
      .append('redirect_uri', environment.oauthCallbackUrl)
      .append('code_verifier', codeVerifier);
    return firstValueFrom(this.http.post(this.authUrl, params, { headers }))
      .then((resp: any) => {
        this.armazenarToken(resp.access_token);
        this.armazenaRefreshToken(resp.refresh_token);
        this.router.navigate(['/cliente']);
        return Promise.resolve();
      })
      .catch((error) => {
        console.error('Erro ao gerar o token com o code.', error);
        return Promise.resolve();
      });
  }

  limparAccessToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('codeVerifier');
    localStorage.removeItem('state');
    this.jwtPayload = null;
  }

  temPermissao(permisao: string) {
    return this.jwtPayload && this.jwtPayload.authorities.includes(permisao);
  }

  getUsername() {
    return this.jwtPayload && this.jwtPayload.userName;
  }

  temQualquerPermissao(roles: string[]) {
    for (const role of roles) {
      if (this.temPermissao(role)) {
        return true;
      }
    }
    return false;
  }

  isLoggedIn(): boolean {
    const token = this.loadLocalToken();
    if (token) {
      return true;
    } else {
      return false;
    }
  }

  logout() {
    this.limparAccessToken();
    window.location.href = `${environment.apiUrl}/logout?redirectTo=${environment.appUrl}`;
  }

  private armazenarToken(token: string) {
    this.jwtPayload = this.jwtHelper.decodeToken(token);
    localStorage.setItem('token', token);
  }

  private armazenaRefreshToken(refresh_token: string) {
    localStorage.setItem('refresh_token', refresh_token);
  }

  private carregarToken() {
    const token = this.loadLocalToken();
    if (token) {
      this.armazenarToken(token);
    }
  }

  private loadLocalToken(): string | null {
    return localStorage.getItem('token');
  }

  private gerarStringAleatoria(tamanho: number) {
    let resultado = '';
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < tamanho; i++) {
      resultado += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return resultado;
  }
}
