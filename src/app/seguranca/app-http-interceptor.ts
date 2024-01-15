import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

export class NotAuthenticationErro {}

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService,) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log("HttpFilter: " + req.url)
    console.log(req.headers);

    if (req.url.includes(environment.fileServiceUrl)) {
      req = req.clone({
        headers: req.headers.delete('Authorization')
      });
      return next.handle(req);
    }

    if (
      !req.url.includes('/oauth2/token') &&
      this.auth.isAccessTokenInvalid()
    ) {
      console.log("Aqui")
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
