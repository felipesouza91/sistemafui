import { HttpParams, HttpClient } from '@angular/common/http';
import { Resultado } from './../core/mode';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';

import { Dvr } from '../core/mode';
import { firstValueFrom } from 'rxjs';

export interface FiltroDvr {
  codCliente: number;
  nomeCliente: string;
  numeroSerie: string;
  fabricante: string;
  modelo: string;
  page: number;
  size: number;
}

@Injectable()
export class DvrService {
  dvrUrl: string;

  constructor(private http: HttpClient) {
    this.dvrUrl = `${environment.apiUrl}/dvrs`;
  }

  editar(dvr: Dvr): Promise<Dvr> {
    return firstValueFrom(this.http.put(`${this.dvrUrl}/${dvr.id}`, dvr)).then(
      (resp) => {
        return resp as Dvr;
      }
    );
  }

  salvar(dvr: any): Promise<Dvr> {
    return firstValueFrom(this.http.post(this.dvrUrl, dvr)).then(
      (resp) => resp as Dvr
    );
  }

  excluir(codigo: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.dvrUrl}/${codigo}`)).then(
      () => null
    );
  }

  pesquisar(filtro: FiltroDvr): Promise<Resultado<Dvr>> {
    return firstValueFrom(
      this.http.get(this.dvrUrl, { params: this.createUrlParams(filtro) })
    ).then(
      (resp: any) =>
        new Resultado<Dvr>(resp.totalElements, resp.first, resp.content)
    );
  }

  buscarPorCodigoCliente(codigo: number): Promise<Dvr[]> {
    let params = new HttpParams().append('codCliente', codigo.toString());
    return firstValueFrom(this.http.get(this.dvrUrl, { params })).then(
      (resp: any) => {
        return resp.content as Dvr[];
      }
    );
  }

  private createUrlParams(filtro: FiltroDvr): HttpParams {
    let params = new HttpParams();
    if (filtro.page === undefined) {
      filtro.page = 0;
    }
    if (filtro.size === undefined) {
      filtro.page = 5;
    }
    if (filtro.page) {
      params = params.append('page', filtro.page.toString());
    }
    if (filtro.size) {
      params = params.append('size', filtro.size.toString());
    }
    if (filtro.codCliente) {
      params = params.append('codCliente', filtro.codCliente.toString());
    }
    if (filtro.nomeCliente) {
      params = params.append('nomeCliente', filtro.nomeCliente);
    }
    if (filtro.numeroSerie) {
      params = params.append('numeroSerie', filtro.numeroSerie);
    }
    if (filtro.fabricante) {
      params = params.append('fabricante', filtro.fabricante);
    }
    if (filtro.modelo) {
      params = params.append('numeroSerie', filtro.modelo);
    }
    return params;
  }
}
