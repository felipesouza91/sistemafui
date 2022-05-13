import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SistemFHttp } from '../seguranca/sistemaf-http';

interface IProfileData {
  nome: string;
  email: string;
  oldPassword: string;
  newPassword: string;
  confirmationNewPassword: string;
}

@Injectable()
export class ProfileService {
  private baseUrl: string;
  constructor(private http: SistemFHttp) {
    this.baseUrl = `${environment.apiUrl}/profile`;
  }

  updatePassword({
    confirmationNewPassword,
    newPassword,
    oldPassword,
  }: IProfileData): Promise<void> {
    return this.http
      .put(`${this.baseUrl}/password`, {
        oldPassword,
        newPassword,
        confirmationNewPassword,
      })
      .toPromise()
      .then((resp) => Promise.resolve());
  }
}
