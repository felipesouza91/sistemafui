import { Permissao } from '../core/mode';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { IAccessGroupInput } from '../core/models-input';
import { ResumoGrupoAcesso } from '../core/model-resumo';
import { HttpClient } from '@angular/common/http';

export interface Item {
  descricao: string;
  id: number;
  tipo: string;
}

@Injectable()
export class GrupoAcessoService {
  private grupoAcessoUrl: string;
  private permissaoUrl: string;
  private tipo: string[] = [
    'CLIENTE',
    'GRUPO',
    'CIDADE',
    'BAIRRO',
    'DVR',
    'MOTIVO_OS',
    'ORDEM_SERVICO',
    'FECHAMENTO_ORDEM',
    'GRAVACAO',
    'USUARIO',
    'ACESSO',
    'ATENDIMENTO',
    'PRODUTO',
    'FABRICANTE',
    'CONTATO',
    'PARTICAO',
    'CLI_INFO',
  ];
  private listItens: Item[] = new Array();
  private listPermissao: Permissao[] = [];

  constructor(private http: HttpClient) {
    this.grupoAcessoUrl = `${environment.apiUrl}/grupoacesso`;
    this.permissaoUrl = `${environment.apiUrl}/permissao`;
  }

  salvar({ ativo, descricao, permissoes }: IAccessGroupInput): Promise<any> {
    return this.http
      .post(this.grupoAcessoUrl, { ativo, descricao, permissoes })
      .toPromise()
      .then((resp) => resp);
  }

  atualizar(
    id: number,
    { ativo, descricao, permissoes }: IAccessGroupInput
  ): Promise<any> {
    return this.http
      .put(`${this.grupoAcessoUrl}/${id}`, { ativo, descricao, permissoes })
      .toPromise()
      .then((resp) => resp);
  }

  excluir(codigo: number): Promise<any> {
    return this.http
      .delete(`${this.grupoAcessoUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  listaGrupoAcessoResumo(): Promise<ResumoGrupoAcesso[] | undefined> {
    return this.http
      .get<ResumoGrupoAcesso[]>(`${this.grupoAcessoUrl}?resumo`)
      .toPromise()
      .then((resp) => resp);
  }

  buscarPorCodigo(codigo: number): Promise<any> {
    return this.http
      .get(`${this.grupoAcessoUrl}/${codigo}`)
      .toPromise()
      .then((resp) => resp);
  }

  listarPermissoes(): Promise<Permissao[]> {
    return this.http
      .get(this.permissaoUrl)
      .toPromise()
      .then((resp) => {
        const list: Permissao[] = resp as Permissao[];
        return list;
      });
  }

  /*itensPermisao() {
    this.listItens = new Array();
    this.listarPermissoes().then(resp => {
      this.tipo.map(t => {
        resp.map(l => {
          if (l.descricao.search(t) >= 0) {
            let titulo: string = null;
            switch (l.descricao.substr(3, 3)) {
              case 'CAD':
                titulo = `Cadastrar ${t}`;
                break;
              case 'REM':
                titulo = `Remover ${t}`;
                break;
              case 'PES':
                titulo = `Pesquisar ${t}`;
                break;
            }
            this.listItens.push({descricao: titulo, id: l.id, tipo: t});
          }
        });
      });
    });
    return this.listItens;
  }*/

  itensPermisao(): Promise<any> {
    this.listItens = new Array();
    return this.listarPermissoes().then((resp) => {
      this.tipo.map((t) => {
        resp.map((l) => {
          if (l.descricao.search(t) >= 0) {
            let titulo!: string;
            switch (l.descricao.substr(3, 3)) {
              case 'CAD':
                titulo = `Cadastrar `;
                break;
              case 'REM':
                titulo = `Remover`;
                break;
              case 'PES':
                titulo = `Pesquisar`;
                break;
            }
            this.listItens.push({ descricao: titulo, id: l.id, tipo: t });
          }
        });
      });
      return Promise.resolve(this.listItens);
    });
  }

  converterPermisao(permisoes: Permissao[]): Permissao[] {
    const permisao: Permissao[] = new Array();
    permisoes.map((p) => {
      this.tipo.map((t) => {
        if (p.descricao.search(t) >= 0) {
          let titulo!: string;
          switch (p.descricao.substr(3, 3)) {
            case 'CAD':
              titulo = `Cadastrar ${t}`;
              break;
            case 'REM':
              titulo = `Remover ${t}`;
              break;
            case 'PES':
              titulo = `Pesquisar ${t}`;
              break;
          }
          permisao.push({ descricao: titulo, id: p.id });
        }
      });
    });
    return permisao;
  }
}
