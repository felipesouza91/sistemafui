import { Fabricante, Resultado } from './../core/mode';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BasicService } from '../core/service.interface';
import { IManufactureInput } from '../core/models-input';
import { firstValueFrom } from 'rxjs';
export interface FabricanteFilter {
  descricao: string;
  page: number;
  size: number;
}

@Injectable()
export class FabricanteService
  implements BasicService<FabricanteFilter, Fabricante>
{
  url: string;
  constructor(private http: HttpClient) {
    this.url = `${environment.apiUrl}/fabricantes`;
  }

  findAll(filtro: FabricanteFilter): Promise<Resultado<Fabricante>> {
    return firstValueFrom(
      this.http.get(this.url, { params: this.createParams(filtro) })
    ).then(
      (resp: any) =>
        new Resultado<Fabricante>(resp.totalElements, resp.first, resp.content)
    );
  }

  findById(id: number): Promise<Fabricante> {
    return firstValueFrom(this.http.get<Fabricante>(`${this.url}/${id}`)).then(
      (resp) => resp as Fabricante
    );
  }

  save({ descricao }: IManufactureInput): Promise<Fabricante> {
    return firstValueFrom(
      this.http.post<Fabricante>(this.url, { descricao })
    ).then((resp) => resp as Fabricante);
  }

  update(id: number, { descricao }: IManufactureInput): Promise<Fabricante> {
    return firstValueFrom(
      this.http.put<Fabricante>(`${this.url}/${id}`, { descricao })
    ).then((resp) => resp as Fabricante);
  }

  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete(`${this.url}/${id}`))
      .then(() => Promise.resolve());
  }

  createParams(filtro: FabricanteFilter): HttpParams {
    let params = new HttpParams();
    if (filtro.page === undefined) {
      filtro.size = 0;
    }
    if (filtro.size === undefined) {
      filtro.size = 5;
    }
    if (filtro.descricao) {
      params = params.set('nome', filtro.descricao);
    }
    if (filtro.size) {
      params = params.set('size', filtro.size.toString());
    }
    if (filtro.page) {
      params = params.set('page', filtro.page.toString());
    }
    return params;
  }
}
