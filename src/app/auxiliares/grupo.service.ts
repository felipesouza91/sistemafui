import { HttpParams, HttpClient } from '@angular/common/http';
import { Resultado, Grupo } from './../core/mode';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IGroupInput } from '../core/models-input';
import { firstValueFrom } from 'rxjs';

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

    return firstValueFrom(this.http.get(this.grupoUrl, { params })).then(
      (resp: any) => {
        return new Resultado<Grupo>(
          resp.totalElemets,
          resp.first,
          resp.content
        );
      }
    );
  }

  salvar({ nome }: IGroupInput): Promise<Grupo> {
    return firstValueFrom(this.http.post(this.grupoUrl, { nome })).then(
      (resutlado) => resutlado as Grupo
    );
  }

  atualizar(id: number, { nome }: IGroupInput): Promise<Grupo> {
    return firstValueFrom(
      this.http.put(`${this.grupoUrl}/${id}`, { nome })
    ).then((resp) => resp as Grupo);
  }

  excluir(codigo: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.grupoUrl}/${codigo}`)).then(
      () => null
    );
  }

  listarTodos(): Promise<Grupo[]> {
    return firstValueFrom(this.http.get(this.grupoUrl)).then(
      (result: any) => result.content as Grupo[]
    );
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
