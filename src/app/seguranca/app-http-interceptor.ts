import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpEvent,
  HttpRequest,
} from '@angular/common/http';

import { AuthService } from './auth.service';

export class NotAuthenticationErro {}

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      !req.url.includes('/oauth2/token') &&
      this.auth.isAccessTokenInvalid()
    ) {
      return from(this.auth.getAccessTokenWithRefreshToken()).pipe(
        mergeMap(() => {
          if (this.auth.isAccessTokenInvalid()) {
            throw new NotAuthenticationErro();
          }
          req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          return next.handle(req);
        })
      );
    }
    return next.handle(req);
  }
}
