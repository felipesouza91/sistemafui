import { Resultado } from './../core/mode';
import { SistemFHttp } from './../seguranca/sistemaf-http';
import * as moment from 'moment';

import { Injectable } from '@angular/core';
import { OrdemServico } from '../core/mode';
import { environment } from '../../environments/environment';
import { HttpParams } from '@angular/common/http';
import { IServiceOrderInput } from '../core/models-input';

export interface FiltroOrdemServico {
  codigoCliente: number;
  tipoFiltro: number;
  descricao: string;
  dataAberturaAte: string;
  dataAberturaDe: string;
  page: number;
  size: number;
}

@Injectable()
export class OrdemServicoService {
  ordemServicoUrl: string;

  constructor(private http: SistemFHttp) {
    this.ordemServicoUrl = `${environment.apiUrl}/ordensservicos`;
  }

  salvar({
    cliente,
    codigoService,
    codigoSigma,
    descricao,
    dvr,
    motivoOs,
    prioridadeOs,
    solicitante,
  }: IServiceOrderInput): Promise<OrdemServico> {
    return this.http
      .post(this.ordemServicoUrl, {
        cliente: { id: cliente.id },
        codigoService,
        codigoSigma,
        descricao,

        motivoOs: { id: motivoOs.id },
        prioridadeOs,
        solicitante,
      })
      .toPromise()
      .then((resp) => resp as OrdemServico);
  }

  editar(
    id: number,
    {
      cliente,
      codigoService,
      codigoSigma,
      descricao,
      dvr,
      motivoOs,
      prioridadeOs,
      solicitante,
    }: IServiceOrderInput
  ): Promise<OrdemServico> {
    return this.http
      .put(`${this.ordemServicoUrl}/${id}`, {
        cliente: { id: cliente.id },
        codigoService,
        codigoSigma,
        descricao,
        motivoOs: { id: motivoOs.id },
        prioridadeOs,
        solicitante,
      })
      .toPromise()
      .then((resp) => this.preparoOrdem(resp as OrdemServico));
  }

  excluir(codigo: number): Promise<any> {
    return this.http
      .delete(`${this.ordemServicoUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  pesquisar(filtro: FiltroOrdemServico): Promise<Resultado<OrdemServico>> {
    return this.http
      .get(this.ordemServicoUrl, { params: this.createUrlParams(filtro) })
      .toPromise()
      .then((resp: any) => {
        return new Resultado<OrdemServico>(
          resp.totalElements,
          resp.first,
          resp.content
        );
      });
  }

  buscarPorCodigo(idOs: number): Promise<OrdemServico> {
    return this.http
      .get(`${this.ordemServicoUrl}/${idOs}`)
      .toPromise()
      .then((resp) => this.preparoOrdem(resp as OrdemServico));
  }

  private preparoOrdem(ordem: OrdemServico): OrdemServico {
    this.converterStringsParaDatas([ordem]);
    return ordem;
  }

  private createUrlParams(filtro: FiltroOrdemServico): HttpParams {
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
    if (filtro.codigoCliente) {
      params = params.set('codigoCliente', filtro.codigoCliente.toString());
    }
    switch (filtro.tipoFiltro) {
      case 1: {
        params = params.set('codigoService', filtro.descricao);
        break;
      }
      case 2: {
        params = params.set('nomeCliente', filtro.descricao);
        break;
      }
      case 3: {
        params = params.set('motivoOs', filtro.descricao);
        break;
      }
      case 4: {
        params = params.set('solicitante', filtro.descricao);
        break;
      }
      case 5: {
        params = params.set('prioridade', filtro.descricao);
        break;
      }
      case 6: {
        if (filtro.dataAberturaDe) {
          params = params.set('dataAberturaDe', filtro.dataAberturaDe);
        }
        if (filtro.dataAberturaAte) {
          params = params.set('dataAberturaAte', filtro.dataAberturaAte);
        }
        break;
      }
      default: {
        break;
      }
    }
    return params;
  }

  private converterStringsParaDatas(ordem: OrdemServico[]) {
    for (const os of ordem) {
      os.dataAbertura = moment(os.dataAbertura, 'YYYY-MM-DD hh:mm').toDate();
    }
  }
}
