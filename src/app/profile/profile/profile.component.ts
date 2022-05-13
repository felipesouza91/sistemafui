import { Component, createPlatformFactory, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { AuthService } from 'src/app/seguranca/auth.service';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  form: FormGroup;
  nome: string;
  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private profileService: ProfileService,
    private errorService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.nome = this.authService.getUsername();
    this.createForm();
    this.createPasswordUpdateValidators();
  }

  update() {
    this.profileService
      .updatePassword(this.form.value)
      .then((resp) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Perfil atualizado com sucesso!',
        });
        this.form.reset();
      })
      .catch((error) => this.errorService.handler(error));
  }

  createForm() {
    this.form = this.fb.group({
      oldPassword: [''],
      newPassword: [''],
      confirmationNewPassword: [''],
    });
  }

  createPasswordUpdateValidators() {
    this.form.get('oldPassword').valueChanges.subscribe((value) => {
      if (value) {
        this.form.get('newPassword').setValidators([Validators.required]);
        this.form
          .get('confirmationNewPassword')
          .setValidators([Validators.required]);
        this.form.get('newPassword').updateValueAndValidity();
        this.form.get('confirmationNewPassword').updateValueAndValidity();
      }
    });
  }
}
