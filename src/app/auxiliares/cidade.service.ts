import { HttpParams, HttpClient } from '@angular/common/http';
import { Cidade, Resultado } from './../core/mode';
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ICityInput } from '../core/models-input';

export interface FiltroCidade {
  nome: string;
  page: number;
  size: number;
}

@Injectable()
export class CidadeService {
  cidadeUrl: string;

  constructor(private http: HttpClient) {
    this.cidadeUrl = `${environment.apiUrl}/cidades`;
  }

  autualizar(id: number, { nome }: ICityInput): Promise<Cidade> {
    return firstValueFrom(
      this.http.put(`${this.cidadeUrl}/${id}`, { nome })
    ).then((response) => response as Cidade);
  }

  salvar({ nome }: ICityInput): Promise<Cidade> {
    return firstValueFrom(this.http.post(this.cidadeUrl, { nome })).then(
      (response) => response as Cidade
    );
  }

  excluir(codigo: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.cidadeUrl}/${codigo}`)).then(
      () => null
    );
  }

  pesquisar(filtro: FiltroCidade): Promise<Resultado<Cidade>> {
    const params = this.criarFiltros(filtro);
    return firstValueFrom(this.http.get(this.cidadeUrl, { params })).then(
      (resp: any) => {
        return new Resultado<Cidade>(
          resp.totalElements,
          resp.first,
          resp.content
        );
      }
    );
  }

  listarTodos(): Promise<Cidade[]> {
    const params = new HttpParams();
    params.append('size', '200');
    return firstValueFrom(this.http.get(this.cidadeUrl, { params })).then(
      (result: any) => {
        return result.content as Cidade[];
      }
    );
  }

  criarFiltros(filtro: FiltroCidade): HttpParams {
    let params = new HttpParams();
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
