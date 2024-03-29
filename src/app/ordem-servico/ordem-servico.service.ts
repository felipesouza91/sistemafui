import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { formatISO, parseISO } from 'date-fns';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { OrdemServico } from '../core/mode';
import { IServiceOrderInput } from '../core/models-input';
import { Resultado } from './../core/mode';

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

  constructor(private http: HttpClient) {
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
    return firstValueFrom(
      this.http.post(this.ordemServicoUrl, {
        cliente: { id: cliente.id },
        codigoService,
        codigoSigma,
        descricao,
        motivoOs: { id: motivoOs.id },
        prioridadeOs,
        solicitante,
      })
    ).then((resp) => resp as OrdemServico);
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
    return firstValueFrom(
      this.http.put(`${this.ordemServicoUrl}/${id}`, {
        cliente: { id: cliente.id },
        codigoService,
        codigoSigma,
        descricao,
        motivoOs: { id: motivoOs.id },
        prioridadeOs,
        solicitante,
      })
    ).then((resp) => this.preparoOrdem(resp as OrdemServico));
  }

  excluir(codigo: number): Promise<any> {
    return firstValueFrom(
      this.http.delete(`${this.ordemServicoUrl}/${codigo}`)
    ).then(() => null);
  }

  pesquisar(filtro: FiltroOrdemServico): Promise<Resultado<OrdemServico>> {
    return firstValueFrom(
      this.http.get(this.ordemServicoUrl, {
        params: this.createUrlParams(filtro),
      })
    ).then((resp: any) => {
      return new Resultado<OrdemServico>(
        resp.totalElements,
        resp.first,
        resp.content
      );
    });
  }

  buscarPorCodigo(idOs: number): Promise<OrdemServico> {
    return firstValueFrom(
      this.http.get(`${this.ordemServicoUrl}/${idOs}`)
    ).then((resp) => this.preparoOrdem(resp as OrdemServico));
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
      os.dataAbertura = parseISO(formatISO(new Date(os.dataAbertura)));
    }
  }
}
