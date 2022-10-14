import { Permissao } from '../core/mode';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResumoGrupoAcesso } from '../core/model-resumo';
import { HttpClient } from '@angular/common/http';
import { AccessGroupDto } from './../core/mode';
import { AccessGroupInput } from '../core/models-input';

export interface Item {
  descricao: string;
  id: number;
  tipo: string;
}

@Injectable()
export class GrupoAcessoService {
  private grupoAcessoUrl: string;
  private permissaoUrl: string;

  constructor(private http: HttpClient) {
    this.grupoAcessoUrl = `${environment.apiUrl}/grupoacesso`;
    this.permissaoUrl = `${environment.apiUrl}/permissao`;
  }

  salvar({ ativo, descricao, permissions }: AccessGroupInput): Promise<any> {
    return firstValueFrom(
      this.http.post(this.grupoAcessoUrl, { ativo, descricao, permissions })
    ).then((resp) => resp);
  }

  atualizar(
    id: number,
    { ativo, descricao, permissions }: AccessGroupInput
  ): Promise<any> {
    return firstValueFrom(
      this.http.put(`${this.grupoAcessoUrl}/${id}`, {
        ativo,
        descricao,
        permissions,
      })
    ).then((resp) => resp);
  }

  excluir(codigo: number): Promise<any> {
    return firstValueFrom(
      this.http.delete(`${this.grupoAcessoUrl}/${codigo}`)
    ).then(() => null);
  }

  listaGrupoAcessoResumo(): Promise<ResumoGrupoAcesso[] | undefined> {
    return firstValueFrom(
      this.http.get<ResumoGrupoAcesso[]>(`${this.grupoAcessoUrl}?resumo`)
    ).then((resp) => resp);
  }

  buscarPorCodigo(codigo: number): Promise<AccessGroupDto> {
    return firstValueFrom(
      this.http.get<AccessGroupDto>(`${this.grupoAcessoUrl}/${codigo}`)
    ).then((resp) => resp);
  }

  listarPermissoes(): Promise<Permissao[]> {
    return firstValueFrom(this.http.get(this.permissaoUrl)).then((resp) => {
      const list: Permissao[] = resp as Permissao[];
      return list;
    });
  }
}
