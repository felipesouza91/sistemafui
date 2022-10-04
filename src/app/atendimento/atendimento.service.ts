import { HttpParams, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from './../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { ResumoAtendimento } from './../core/model-resumo';
import { Atendimento, Resultado } from './../core/mode';
import { format, parseISO } from 'date-fns';

export interface AtendimentoFilter {
  idCliente: number;
  size: number;
  page: number;
}

@Injectable()
export class AtendimentoService {
  atendimentoUrl: string;
  constructor(private http: HttpClient) {
    this.atendimentoUrl = `${environment.apiUrl}/atendimentos`;
  }

  salvar(atendimento: any): Promise<Atendimento> {
    return firstValueFrom(
      this.http.post(this.atendimentoUrl, atendimento)
    ).then((resp) => {
      const atendimentoSalvo = resp as Atendimento;
      this.converterStringsParaDatas([atendimentoSalvo]);
      return atendimentoSalvo;
    });
  }

  atualizar(atendimento: any): Promise<Atendimento> {
    return firstValueFrom(
      this.http.put(`${this.atendimentoUrl}/${atendimento.id}`, atendimento)
    ).then((resp) => {
      const atendimentoSalvo = resp as Atendimento;
      this.converterStringsParaDatas([atendimentoSalvo]);
      return atendimentoSalvo;
    });
  }

  pesquisar(filter: AtendimentoFilter): Promise<Resultado<Atendimento>> {
    return firstValueFrom(
      this.http.get(this.atendimentoUrl, { params: this.criarFiltro(filter) })
    ).then((resp: any) => {
      return new Resultado<Atendimento>(
        resp.totalElements,
        resp.first,
        resp.content as Atendimento[]
      );
    });
  }

  getById(id: number): Promise<Atendimento | undefined> {
    return firstValueFrom(
      this.http.get<Atendimento>(`${this.atendimentoUrl}/${id}`)
    );
  }

  pesquisarResumo(
    filter: AtendimentoFilter
  ): Promise<Resultado<ResumoAtendimento>> {
    return firstValueFrom(
      this.http.get(`${this.atendimentoUrl}?resumo`, {
        params: this.criarFiltro(filter),
      })
    ).then((resp: any) => {
      return new Resultado<ResumoAtendimento>(
        resp.totalElements,
        resp.first,
        resp.content as ResumoAtendimento[]
      );
    });
  }

  private criarFiltro(filter: AtendimentoFilter): HttpParams {
    if (filter.size === null) {
      filter.size = 5;
    }
    if (filter.page === null) {
      filter.page = 0;
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
      at.dataInicio = parseISO(format(at.dataInicio, 'YYYY-MM-DD hh:mm'));
      if (at.dataTermino) {
        at.dataTermino = parseISO(format(at.dataTermino, 'YYYY-MM-DD hh:mm'));
      }
    }
  }
}
