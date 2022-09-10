import { HttpParams } from '@angular/common/http';
import { VerificacaoGravacao, Resultado } from './../core/mode';

import {  format, parseISO} from 'date-fns'
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { SistemFHttp } from '../seguranca/sistemaf-http';
import { IRecordingCheckInput } from '../core/models-input';

export interface VerificaGravacaoFilter {
  codigoDvr: number;
  codigoCliente: number;
  nomeCliente: string;
  dataVerificacaoDe: Date;
  dataVerificacaoAte: Date;
  page: number;
  size: number;
}

@Injectable()
export class VerificacaoService {
  verificacaoUrl: string;

  constructor(private http: SistemFHttp) {
    this.verificacaoUrl = `${environment.apiUrl}/verificacoes`;
  }

  salvar({
    dvr,
    hd,
    qtdGravacao,
    status,
  }: IRecordingCheckInput): Promise<VerificacaoGravacao> {
    return this.http
      .post(this.verificacaoUrl, {
        dvr: { id: dvr.id },
        hd,
        qtdGravacao,
        status,
      })
      .toPromise()
      .then((resp) => resp as VerificacaoGravacao);
  }

  atualizar(
    id: number,
    { dvr, hd, qtdGravacao, status }: IRecordingCheckInput
  ): Promise<VerificacaoGravacao> {
    return this.http
      .put(`${this.verificacaoUrl}/${id}`, {
        dvr: { id: dvr.id },
        hd,
        qtdGravacao,
        status,
      })
      .toPromise()
      .then((resp) => resp as VerificacaoGravacao);
  }

  excluir(id: number): Promise<any> {
    return this.http
      .delete(`${this.verificacaoUrl}/${id}`)
      .toPromise()
      .then(() => null);
  }

  pesquisa(
    filtro: VerificaGravacaoFilter,
    resumo: boolean
  ): Promise<Resultado<VerificacaoGravacao>> {
    let url: string;
    if (resumo) {
      url = `${this.verificacaoUrl}?resumo`;
    } else {
      url = this.verificacaoUrl;
    }
    return this.http
      .get(url, { params: this.createUrlParams(filtro) })
      .toPromise()
      .then(
        (resp: any) =>
          new Resultado<VerificacaoGravacao>(
            resp.totalElements,
            resp.first,
            resp.content
          )
      );
  }

  buscarPorCodigo(id: number): Promise<VerificacaoGravacao> {
    return this.http
      .get(`${this.verificacaoUrl}/${id}`)
      .toPromise()
      .then((resp) => {
        const verificacao = resp as VerificacaoGravacao;
        this.converterStringsParaDatas([verificacao]);
        return verificacao;
      });
  }

  private converterStringsParaDatas(verificacoes: VerificacaoGravacao[]) {
    for (const verificacao of verificacoes) {
      verificacao.dataTeste = parseISO(format(
        verificacao.dataTeste,
        'YYYY-MM-DD hh:mm'
      ));
    }
  }

  private createUrlParams(filtro: VerificaGravacaoFilter): HttpParams {
    let params = new HttpParams();
    if (filtro.page === undefined) {
      filtro.page = 0;
    }
    if (filtro.size === undefined) {
      filtro.size = 5;
    }
    if (filtro.page) {
      params = params.set('page', filtro.page.toString());
    }
    if (filtro.size) {
      params = params.set('size', filtro.size.toString());
    }
    if (filtro.codigoDvr) {
      params = params.set('codigoDvr', filtro.codigoDvr.toString());
    }
    if (filtro.codigoCliente) {
      params = params.set('codigoCliente', filtro.codigoCliente.toString());
    }
    if (filtro.nomeCliente) {
      params = params.set('nomeCliente', filtro.nomeCliente);
    }
    return params;
  }
}
