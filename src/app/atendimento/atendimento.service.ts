import { HttpParams } from '@angular/common/http';
import { SistemFHttp } from './../seguranca/sistemaf-http';
import { Injectable } from '@angular/core';

import { environment } from './../../environments/environment';

import { ResumoAtendimento } from './../core/model-resumo';
import { Atendimento, Resultado } from './../core/mode';
import * as moment from 'moment';

export interface AtendimentoFilter {
  idCliente: number;
  size: number;
  page: number;
}

@Injectable()
export class AtendimentoService {
  atendimentoUrl: string;
  constructor(private http: SistemFHttp) {
    this.atendimentoUrl = `${environment.apiUrl}/atendimentos`;
  }

  salvar(atendimento: any): Promise<Atendimento> {
    return this.http
      .post(this.atendimentoUrl, atendimento)
      .toPromise()
      .then((resp) => {
        const atendimentoSalvo = resp as Atendimento;
        this.converterStringsParaDatas([atendimentoSalvo]);
        return atendimentoSalvo;
      });
  }

  atualizar(atendimento: any): Promise<Atendimento> {
    return this.http
      .put(`${this.atendimentoUrl}/${atendimento.id}`, atendimento)
      .toPromise()
      .then((resp) => {
        const atendimentoSalvo = resp as Atendimento;
        this.converterStringsParaDatas([atendimentoSalvo]);
        return atendimentoSalvo;
      });
  }

  pesquisar(filter: AtendimentoFilter): Promise<Resultado<Atendimento>> {
    return this.http
      .get(this.atendimentoUrl, { params: this.criarFiltro(filter) })
      .toPromise()
      .then((resp: any) => {
        return new Resultado<Atendimento>(
          resp.totalElements,
          resp.first,
          resp.content as Atendimento[]
        );
      });
  }

  getById(id: number): Promise<Atendimento | undefined> {
    return this.http
      .get<Atendimento>(`${this.atendimentoUrl}/${id}`)
      .toPromise();
  }

  pesquisarResumo(
    filter: AtendimentoFilter
  ): Promise<Resultado<ResumoAtendimento>> {
    return this.http
      .get(`${this.atendimentoUrl}?resumo`, {
        params: this.criarFiltro(filter),
      })
      .toPromise()
      .then((resp: any) => {
        return new Resultado<ResumoAtendimento>(
          resp.totalElements,
          resp.first,
          resp.content as ResumoAtendimento[]
        );
      });
  }

  private criarFiltro(filter: AtendimentoFilter): HttpParams {
    if (filter.size == null) {
      filter.size = 0;
    }
    let params = new HttpParams();
    if (filter.idCliente) {
      params = params.set('idCliente', filter.idCliente.toString());
    }
    if (filter.page) {
      params = params.set('page', filter.page.toString());
    }
    if (filter.size) {
      params = params.set('size', filter.size.toString());
    }
    return params;
  }

  private converterStringsParaDatas(atendimentos: Atendimento[]) {
    for (const at of atendimentos) {
      at.dataInicio = moment(at.dataInicio, 'YYYY-MM-DD hh:mm').toDate();
      if (at.dataTermino) {
        at.dataTermino = moment(at.dataTermino, 'YYYY-MM-DD hh:mm').toDate();
      }
    }
  }
}
