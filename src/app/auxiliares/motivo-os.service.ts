import { HttpParams } from '@angular/common/http';
import { SistemFHttp } from './../seguranca/sistemaf-http';
import { MotivoOs, Resultado } from './../core/mode';
import { environment } from '../../environments/environment';

import { Injectable } from '@angular/core';
import { IServiceOrderReason } from '../core/models-input';

export class FiltroMotivoOs {
  descricao: string;
  page = 0;
  size = 5;
}

@Injectable()
export class MotivoOsService {
  motivoOsUrl: string;

  constructor(private http: SistemFHttp) {
    this.motivoOsUrl = `${environment.apiUrl}/motivososs`;
  }

  salvar({ descricao }: IServiceOrderReason): Promise<MotivoOs> {
    return this.http
      .post(this.motivoOsUrl, { descricao })
      .toPromise()
      .then((resp) => resp as MotivoOs);
  }

  editar(id: number, { descricao }: IServiceOrderReason): Promise<MotivoOs> {
    return this.http
      .put(`${this.motivoOsUrl}/${id}`, { descricao })
      .toPromise()
      .then((resp) => resp as MotivoOs);
  }

  excluir(codigo: number): Promise<any> {
    const headers = new Headers();
    return this.http
      .delete(`${this.motivoOsUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  pesquisar(filtro: FiltroMotivoOs): Promise<Resultado<MotivoOs>> {
    const params = this.getParams(filtro);
    return this.http
      .get(this.motivoOsUrl, { params })
      .toPromise()
      .then((result: any) => {
        return new Resultado<MotivoOs>(
          result.totalElements,
          result.first,
          result.content as MotivoOs[]
        );
      });
  }

  pesquisarTodos(): Promise<MotivoOs[]> {
    const headers = new Headers();
    return this.http
      .get(this.motivoOsUrl)
      .toPromise()
      .then((result: any) => {
        return result.content as MotivoOs[];
      });
  }

  private getParams(filtro: FiltroMotivoOs): HttpParams {
    let params = new HttpParams();
    if (filtro.descricao) {
      params = params.set('descricao', filtro.descricao);
    }
    if (filtro.page) {
      params = params.set('page', filtro.page.toString());
    }
    if (filtro.size) {
      params = params.set('size', filtro.size.toString());
    }
    return params;
  }
}
