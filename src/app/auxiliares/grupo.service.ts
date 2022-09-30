import { HttpParams, HttpClient } from '@angular/common/http';
import { Resultado, Grupo } from './../core/mode';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IGroupInput } from '../core/models-input';

export interface FiltroGrupo {
  nome: string;
  page: number;
  size: number;
}

@Injectable()
export class GrupoService {
  grupoUrl: string;

  constructor(private http: HttpClient) {
    this.grupoUrl = `${environment.apiUrl}/grupos`;
  }

  pesquisar(filtro: FiltroGrupo): Promise<Resultado<Grupo>> {
    const params = this.getFilter(filtro);
    return this.http
      .get(this.grupoUrl, { params })
      .toPromise()
      .then((resp: any) => {
        return new Resultado<Grupo>(
          resp.totalElemets,
          resp.first,
          resp.content
        );
      });
  }

  salvar({ nome }: IGroupInput): Promise<Grupo> {
    return this.http
      .post(this.grupoUrl, { nome })
      .toPromise()
      .then((resutlado) => resutlado as Grupo);
  }

  atualizar(id: number, { nome }: IGroupInput): Promise<Grupo> {
    return this.http
      .put(`${this.grupoUrl}/${id}`, { nome })
      .toPromise()
      .then((resp) => resp as Grupo);
  }

  excluir(codigo: number): Promise<any> {
    return this.http
      .delete(`${this.grupoUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  listarTodos(): Promise<Grupo[]> {
    return this.http
      .get(this.grupoUrl)
      .toPromise()
      .then((result: any) => result.content as Grupo[]);
  }

  private getFilter(filtro: FiltroGrupo): HttpParams {
    let params = new HttpParams();
    if (filtro.page === undefined) {
      filtro.page = 0;
    }
    if (filtro.size === undefined) {
      filtro.size = 5;
    }
    if (filtro.nome) {
      params = params.set('nome', filtro.nome);
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
