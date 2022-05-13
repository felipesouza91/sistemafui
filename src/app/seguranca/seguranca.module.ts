import { PasswordModule } from 'primeng/password';
import { LogoutService } from './logout.service';
import { AuthGuard } from './auth.guard';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JwtModule } from '@auth0/angular-jwt';

import { ButtonModule } from 'primeng/button';

import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { SegurancaRoutingModule } from './seguranca-routing.module';
import { LoginFormComponent } from './login-form/login-form.component';
import { environment } from '../../environments/environment';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: environment.tokenWhitelistedDomains,
        blacklistedRoutes: environment.tokenBlacklistedRoutes,
      },
    }),
    SegurancaRoutingModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    ButtonModule,
  ],
  declarations: [LoginFormComponent],
  exports: [],
  providers: [AuthGuard, LogoutService],
})
export class SegurancaModule {}
