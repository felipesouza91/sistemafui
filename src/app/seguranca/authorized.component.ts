import { AuthService } from 'src/app/seguranca/auth.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-authorized',
  template: ``,
  styles: [],
})
export class AuthorizedComponent implements OnInit {
  constructor(
    private activetedRoute: ActivatedRoute,
    private authService: AuthService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.activetedRoute.queryParamMap.subscribe((params: any) => {
      const { code, state } = params.params;
      console.log(code);
      if (code) {
        this.authService
          .getAccessTokeWithToken(code, state)
          .then(() => {
            this.route.navigate(['/']);
          })
          .catch((e: any) => {
            console.error('Erro no callback');
          });
      } else {
        this.route.navigate(['/']);
      }
    });
  }
}
