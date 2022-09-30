import { Informacao, ClienteInformacao, Resultado } from './../core/mode';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { format, parseISO } from 'date-fns';

export interface InformacaoFilter {
  idCliente: number;
  page: number;
  size: number;
  idUserCreate: number;
  userCreate: string;
}

@Injectable()
export class InformacaoService {
  informacaoUrl: string;
  constructor(private http: HttpClient) {
    this.informacaoUrl = `${environment.apiUrl}/clients`;
  }

  findAll(filter: InformacaoFilter): Promise<Resultado<Informacao>> {
    return this.http
      .get(`${this.informacaoUrl}/${filter.idCliente}/info`, {
        params: this.createUrlParams(filter),
      })
      .toPromise()
      .then(
        (resp: any) =>
          new Resultado<Informacao>(
            resp.totalElements,
            resp.first,
            resp.content
          )
      );
  }

  findById(clientId: number, infoId: number): Promise<ClienteInformacao> {
    return this.http
      .get<Informacao>(`${this.informacaoUrl}/${clientId}/info/${infoId}`)
      .toPromise()
      .then((resp) => this.prepararInfo(resp!) as ClienteInformacao);
  }

  save(
    idCliente: number,
    { descricao }: ClienteInformacao
  ): Promise<ClienteInformacao> {
    return this.http
      .post(`${this.informacaoUrl}/${idCliente}/info`, { descricao })
      .toPromise()
      .then((resp) => resp as ClienteInformacao);
  }

  update(
    clientId: number,
    idInfo: number,
    { descricao }: Informacao
  ): Promise<Informacao> {
    return this.http
      .put<Informacao>(`${this.informacaoUrl}/${clientId}/info/${idInfo}`, {
        descricao,
      })
      .toPromise()
      .then((value) => value as Informacao);
  }

  delete(clientId: number, idInfor: number): Promise<void> {
    return this.http
      .delete(`${this.informacaoUrl}/${clientId}/info/${idInfor}`)
      .toPromise()
      .then();
  }

  private prepararInfo(ordem: Informacao): Informacao {
    this.converterStringsParaDatas([ordem]);
    return ordem;
  }

  private converterStringsParaDatas(infos: Informacao[]) {
    for (const info of infos) {
      info.creationDate = parseISO(info.creationDate.toString());
      if (info.lastModifiedDate) parseISO(info.lastModifiedDate.toISOString());
    }
  }

  private createUrlParams(filtro: InformacaoFilter): HttpParams {
    let params = new HttpParams();
    if (filtro.page) {
      params = params.set('page', filtro.page.toString());
    }
    if (filtro.size) {
      params = params.set('size', filtro.size.toString());
    }
    if (filtro.idCliente !== null) {
      params = params.set('idCliente', filtro.idCliente.toString());
    }
    if (filtro.idUserCreate !== null) {
      params = params.set('idCliente', filtro.idCliente.toString());
    }
    if (filtro.userCreate !== null) {
      params = params.set('idCliente', filtro.idCliente.toString());
    }
    return params;
  }
}
