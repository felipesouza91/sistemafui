import { HttpParams } from '@angular/common/http';
import { SistemFHttp } from './../seguranca/sistemaf-http';
import { Resultado } from './../core/mode';
import { Usuario } from '../core/mode';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IUserInput } from '../core/models-input';

export class UsuarioFiltro {
  funcionario: string;
  apelido: string;
  grupoAcesso: string;
  page: number;
  size = 5;
}

@Injectable()
export class UsuarioService {
  usuarioUrl: string;

  constructor(private http: SistemFHttp) {
    this.usuarioUrl = `${environment.apiUrl}/usuario`;
  }

  salvar({
    apelido,
    ativo,
    grupoAcesso,
    nome,
    senha,
  }: IUserInput): Promise<Usuario> {
    return this.http
      .post(this.usuarioUrl, {
        apelido,
        ativo,
        grupoAcesso: { id: grupoAcesso.id },
        nome,
        senha,
      })
      .toPromise()
      .then((resp) => {
        return resp as Usuario;
      });
  }

  atualizar(
    id: number,
    { apelido, ativo, grupoAcesso, nome, senha }: IUserInput
  ): Promise<Usuario> {
    return this.http
      .put(`${this.usuarioUrl}/${id}`, {
        apelido,
        ativo,
        grupoAcesso: { id: grupoAcesso.id },
        nome,
        senha,
      })
      .toPromise()
      .then((resp) => resp as Usuario);
  }

  pesquisar(filter: UsuarioFiltro): Promise<Resultado<Usuario>> {
    return this.http
      .get(this.usuarioUrl, { params: this.createUrlParams(filter) })
      .toPromise()
      .then((resp: any) => {
        return new Resultado<Usuario>(
          resp.totalElements,
          resp.first,
          resp.content as Usuario[]
        );
      });
  }

  buscarPorCodigo(codigo: number): Promise<Usuario> {
    return this.http
      .get(`${this.usuarioUrl}/${codigo}`)
      .toPromise()
      .then((resp) => resp as Usuario);
  }

  buscarResumo(): Promise<Usuario[]> {
    return this.http
      .get(`${this.usuarioUrl}?resumo`)
      .toPromise()
      .then((resp) => {
        return resp as Usuario[];
      });
  }
  private createUrlParams(filter: UsuarioFiltro) {
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
