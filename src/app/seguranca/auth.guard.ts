import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';

import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.auth.isAccessTokenInvalid()) {
      return this.auth.getAccessTokenWithRefreshToken().then(() => {
        if (this.auth.isAccessTokenInvalid()) {
          this.auth.login();
          return false;
        }
        return true;
      });
    } else if (
      next.data['roles'] &&
      !this.auth.temQualquerPermissao(next.data['roles'])
    ) {
      this.router.navigate(['/nao-autorizado']);
      return false;
    }
    return true;
  }
}
