import { HttpParams, HttpClient } from '@angular/common/http';
import { MotivoOs, Resultado } from './../core/mode';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { IServiceOrderReason } from '../core/models-input';

export interface FiltroMotivoOs {
  descricao: string;
  page: number;
  size: number;
}

@Injectable()
export class MotivoOsService {
  motivoOsUrl: string;

  constructor(private http: HttpClient) {
    this.motivoOsUrl = `${environment.apiUrl}/motivososs`;
  }

  salvar({ descricao }: IServiceOrderReason): Promise<MotivoOs> {
    return firstValueFrom(this.http.post(this.motivoOsUrl, { descricao })).then(
      (resp) => resp as MotivoOs
    );
  }

  editar(id: number, { descricao }: IServiceOrderReason): Promise<MotivoOs> {
    return firstValueFrom(
      this.http.put(`${this.motivoOsUrl}/${id}`, { descricao })
    ).then((resp) => resp as MotivoOs);
  }

  excluir(codigo: number): Promise<any> {
    return firstValueFrom(
      this.http.delete(`${this.motivoOsUrl}/${codigo}`)
    ).then(() => null);
  }

  pesquisar(filtro: FiltroMotivoOs): Promise<Resultado<MotivoOs>> {
    const params = this.getParams(filtro);
    return firstValueFrom(this.http.get(this.motivoOsUrl, { params })).then(
      (result: any) => {
        return new Resultado<MotivoOs>(
          result.totalElements,
          result.first,
          result.content as MotivoOs[]
        );
      }
    );
  }

  pesquisarTodos(): Promise<MotivoOs[]> {
    return firstValueFrom(this.http.get(this.motivoOsUrl)).then(
      (result: any) => {
        return result.content as MotivoOs[];
      }
    );
  }

  private getParams(filtro: FiltroMotivoOs): HttpParams {
    let params = new HttpParams();
    if (filtro.page === undefined) {
      filtro.page = 0;
    }
    if (filtro.size === undefined) {
      filtro.size = 5;
    }
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
