import { from as observableFrom, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { AuthService } from './auth.service';

export class NotAuthenticationErro {}

@Injectable()
export class SistemFHttp extends HttpClient {
  constructor(private auth: AuthService, private handlerHttp: HttpHandler) {
    super(handlerHttp);
  }

  public override delete<T>(url: string, options?: any): Observable<T> {
    return this.fazerRequisicao(() => super.delete<T>(url, options));
  }

  public override patch<T>(
    url: string,
    body: any,
    options?: any
  ): Observable<T> {
    return this.fazerRequisicao(() => super.patch<T>(url, options));
  }

  public override head<T>(url: string, options?: any): Observable<T> {
    return this.fazerRequisicao(() => super.head<T>(url, options));
  }

  public override options<T>(url: string, options?: any): Observable<T> {
    return this.fazerRequisicao(() => super.options<T>(url, options));
  }

  public override get<T>(url: string, options?: any): Observable<T> {
    return this.fazerRequisicao(() => super.get<T>(url, options));
  }

  public override post<T>(
    url: string,
    body: any,
    options?: any
  ): Observable<T> {
    return this.fazerRequisicao(() => super.post<T>(url, body, options));
  }

  public override put<T>(url: string, body: any, options?: any): Observable<T> {
    return this.fazerRequisicao(() => super.put<T>(url, body, options));
  }

  private fazerRequisicao<T>(fn: Function): Observable<T> {
    if (this.auth.isAccessTokenInvalid()) {
      return fn();
    } else {
      return fn();
    }
  }
}
