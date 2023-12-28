import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { firstValueFrom } from 'rxjs';
import { Bairro, Resultado } from '../core/mode';
import { INeighborhoodInput } from '../core/models-input';

export interface FiltroBairro {
  nome: string;
  cidade: {
    id: number;
    nome: string;
  };
  page: number;
  size: number;
}

@Injectable()
export class BairroService {
  bairroUrl: string;

  constructor(private http: HttpClient) {
    this.bairroUrl = `${environment.apiUrl}/bairros`;
  }

  salvar({ nome, cidade }: INeighborhoodInput): Promise<any> {
    return firstValueFrom(
      this.http.post(this.bairroUrl, { nome, cidade: { id: cidade.id } })
    ).then((resp) => resp);
  }

  editar(id: number, { nome, cidade }: INeighborhoodInput): Promise<Bairro> {
    return firstValueFrom(
      this.http.put(`${this.bairroUrl}/${id}`, {
        nome,
        cidade: { id: cidade.id },
      })
    ).then((resp) => resp as Bairro);
  }

  excluir(codigo: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.bairroUrl}/${codigo}`)).then(
      () => null
    );
  }

  pesquisar(filtro: FiltroBairro): Promise<Resultado<Bairro>> {
    const params = this.createFilter(filtro);
    return firstValueFrom(this.http.get(this.bairroUrl, { params })).then((resp: any) => {
      return new Resultado<Bairro>(
        resp.totalElements,
        resp.first,
        resp.content as Bairro[]
      );
    });
  }

  pesquisarPorCodigo(id: number): Promise<Bairro> {
    return firstValueFrom(this.http.get(`${this.bairroUrl}/${id}`)).then(
      (result) => {
        return result as Bairro;
      }
    );
  }

  createFilter(filtro: FiltroBairro): HttpParams {
    let params = new HttpParams();
    if (filtro.page === undefined) {
      filtro.page = 0;
    }
    if (filtro.size === undefined) {
      filtro.size = 5;
    }
    if (filtro.nome !== null) {
      params = params.set('nome', filtro.nome);
    }
    if (filtro.cidade !== null) {
      params = params.set('nomeCidade', filtro.cidade.nome);
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
