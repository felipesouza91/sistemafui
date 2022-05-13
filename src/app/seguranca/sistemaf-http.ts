import {from as observableFrom, Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHandler} from '@angular/common/http';

import {AuthService} from './auth.service';

export class NotAuthenticationErro {}

@Injectable()
export class SistemFHttp extends HttpClient {
  constructor(private auth: AuthService, private handlerHttp: HttpHandler) {
    super(handlerHttp);
  }

  public delete<T>(url: string, options?: any): Observable<T> {
    return this.fazerRequisicao(() => super.delete<T>(url, options));
  }

  public patch<T>(url: string, body: any, options?: any): Observable<T> {
    return this.fazerRequisicao(() => super.patch<T>(url, options));
  }

  public head<T>(url: string, options?: any): Observable<T> {
    return this.fazerRequisicao(() => super.head<T>(url, options));
  }

  public options<T>(url: string, options?: any): Observable<T> {
    return this.fazerRequisicao(() => super.options<T>(url, options));
  }

  public get<T>(url: string, options?: any): Observable<T> {
    return this.fazerRequisicao(() => super.get<T>(url, options));
  }

  public post<T>(url: string, body: any, options?: any): Observable<T> {
    return this.fazerRequisicao(() => super.post<T>(url, body, options));
  }

  public put<T>(url: string, body: any, options?: any): Observable<T> {
    return this.fazerRequisicao(() => super.put<T>(url, body, options));
  }

  private fazerRequisicao<T>(fn: Function): Observable<T> {
    if (this.auth.isAccessTokenInvalid()) {
      const chamadaNovoAccessToken = this.auth.obterNovoAccessToken().then(() => {
        if (this.auth.isAccessTokenInvalid()) {
          throw new NotAuthenticationErro();
        }
        return fn().toPromise();
      });

      return observableFrom(chamadaNovoAccessToken);
    } else {
      return fn();
    }
  }
}
