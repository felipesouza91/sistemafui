import { HttpParams, HttpClient } from '@angular/common/http';
import { BasicService } from './../core/service.interface';
import { Injectable } from '@angular/core';
import { Produto, Resultado } from '../core/mode';
import { environment } from 'src/environments/environment';
import { IProductInput } from '../core/models-input';
import { firstValueFrom } from 'rxjs';
export interface ProdutoFilter {
  modelo: string;
  nomeFabricante: string;
  idFabricante: number;
  page: number;
  size: number;
}

@Injectable()
export class ProdutoService implements BasicService<ProdutoFilter, Produto> {
  url: string;
  constructor(private http: HttpClient) {
    this.url = `${environment.apiUrl}/produtos`;
  }

  findAll(filtro: ProdutoFilter): Promise<Resultado<Produto>> {
    return firstValueFrom(
      this.http.get(this.url, { params: this.createParams(filtro) })
    ).then(
      (resp: any) =>
        new Resultado<Produto>(resp.totalElements, resp.first, resp.content)
    );
  }
  findById(id: number): Promise<Produto> {
    return firstValueFrom(this.http.get<Produto>(`${this.url}/${id}`)).then(
      (resp) => resp as Produto
    );
  }
  save({
    descricao,
    fabricante,
    modelo,
    valorUnitario,
  }: IProductInput): Promise<Produto> {
    return firstValueFrom(
      this.http.post<Produto>(this.url, {
        descricao,
        fabricante: { id: fabricante.id },
        modelo,
        valorUnitario,
      })
    ).then((resp) => resp as Produto);
  }
  update(
    id: number,
    { descricao, fabricante, modelo, valorUnitario }: IProductInput
  ): Promise<Produto> {
    return firstValueFrom(
      this.http.put<Produto>(`${this.url}/${id}`, {
        descricao,
        fabricante: { id: fabricante.id },
        modelo,
        valorUnitario,
      })
    ).then((resp) => resp as Produto);
  }
  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete(`${this.url}/${id}`)).then(() =>
      Promise.resolve()
    );
  }
  createParams(filtro: ProdutoFilter): HttpParams {
    let params = new HttpParams();
    if (filtro.page === undefined) {
      filtro.page = 0;
    }
    if (filtro.size === undefined) {
      filtro.size = 5;
    }
    if (filtro.modelo) {
      params = params.set('modelo', filtro.modelo);
    }
    if (filtro.nomeFabricante) {
      params = params.set('nomeFabricante', filtro.nomeFabricante);
    }
    if (filtro.idFabricante) {
      params = params.set('idFabricante', filtro.idFabricante.toString());
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
