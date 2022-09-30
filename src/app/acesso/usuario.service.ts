import { HttpParams, HttpClient } from '@angular/common/http';
import { Resultado } from './../core/mode';
import { Usuario } from '../core/mode';
import { firstValueFrom } from 'rxjs';

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IUserInput } from '../core/models-input';

export interface UsuarioFiltro {
  funcionario: string;
  apelido: string;
  grupoAcesso: string;
  page: number;
  size: number;
}

@Injectable()
export class UsuarioService {
  usuarioUrl: string;

  constructor(private http: HttpClient) {
    this.usuarioUrl = `${environment.apiUrl}/usuario`;
  }

  salvar({
    apelido,
    ativo,
    grupoAcesso,
    nome,
    senha,
  }: IUserInput): Promise<Usuario> {
    return firstValueFrom(
      this.http.post(this.usuarioUrl, {
        apelido,
        ativo,
        grupoAcesso: { id: grupoAcesso.id },
        nome,
        senha,
      })
    ).then((resp) => {
      return resp as Usuario;
    });
  }

  atualizar(
    id: number,
    { apelido, ativo, grupoAcesso, nome, senha }: IUserInput
  ): Promise<Usuario> {
    return firstValueFrom(
      this.http.put(`${this.usuarioUrl}/${id}`, {
        apelido,
        ativo,
        grupoAcesso: { id: grupoAcesso.id },
        nome,
        senha,
      })
    ).then((resp) => resp as Usuario);
  }

  pesquisar(filter: UsuarioFiltro): Promise<Resultado<Usuario>> {
    return firstValueFrom(
      this.http.get(this.usuarioUrl, { params: this.createUrlParams(filter) })
    ).then((resp: any) => {
      return new Resultado<Usuario>(
        resp.totalElements,
        resp.first,
        resp.content as Usuario[]
      );
    });
  }

  buscarPorCodigo(codigo: number): Promise<Usuario> {
    return firstValueFrom(this.http.get(`${this.usuarioUrl}/${codigo}`)).then(
      (resp) => resp as Usuario
    );
  }

  buscarResumo(): Promise<Usuario[] | undefined> {
    return firstValueFrom(
      this.http.get<Usuario[]>(`${this.usuarioUrl}?resumo`)
    ).then((resp) => {
      return resp;
    });
  }
  private createUrlParams(filter: UsuarioFiltro) {
    if (filter.size == null) {
      filter.size = 0;
    }
    let params = new HttpParams();
    if (filter.page) {
      params = params.append('page', filter.page.toString());
    }
    if (filter.size) {
      params = params.append('size', filter.size.toString());
    }
    if (filter.apelido) {
      params = params.append('apelido', filter.apelido);
    }
    if (filter.funcionario) {
      params = params.append('funcionario', filter.funcionario);
    }
    if (filter.grupoAcesso) {
      params = params.append('grupoAcesso', filter.grupoAcesso);
    }
    return params;
  }
}
