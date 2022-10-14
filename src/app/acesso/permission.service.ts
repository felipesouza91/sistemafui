import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IPermissionAvailableDto } from '../core/mode';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private url: string;
  constructor(private httpClient: HttpClient) {
    this.url = `${environment.apiUrl}/permissao/available`;
  }

  async loadAvailablePermissions(): Promise<IPermissionAvailableDto[]> {
    const response = await firstValueFrom(
      this.httpClient.get<IPermissionAvailableDto[]>(this.url)
    );

    return response.sort((item0, item1) =>
      item0.formattedName > item1.formattedName ? 1 : -1
    );
  }
}
