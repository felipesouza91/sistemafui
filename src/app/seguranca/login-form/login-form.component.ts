import { AuthService } from './../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { Router } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit {
  form: FormGroup;
  constructor(
    private router: Router,
    private errorService: ErrorHandlerService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      login: new FormControl(null, Validators.required),
      senha: new FormControl(null, Validators.required),
    });
  }

  login() {
    this.authService
      .login(this.form.value)
      .then(() => {
        this.router.navigate(['/cliente']);
      })
      .catch((error) => {
        this.form.get('senha').setValue('');
        this.errorService.handler(error);
      });
  }
}
