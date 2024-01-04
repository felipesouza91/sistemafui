import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

import { firstValueFrom } from 'rxjs';
import { Cliente } from '../core/mode';
import { IClientInput } from '../core/models-input';
import { Resultado } from './../core/mode';
export interface FiltroCliente {
  ativo: boolean;
  tipoFiltro: number;
  descricao: string;
  page: number;
  size: number;
}

interface FileDTO {
  id: string;
  fileName: string;
  contentType: string;
  fileUrl: string
}

interface IUploadURLResponse {
  fileReferenceId: string;
  uploadUrl: string
}

interface IFileUploadData {
  clientId: number;
  fileName: string;
  contentType: string
}

@Injectable()
export class ClienteService {

  clienteUrl: string;
  clientUrlV2: string;

  constructor(private http: HttpClient) {
    this.clienteUrl = `${environment.apiUrl}/clientes`;
    this.clientUrlV2 = `${environment.apiUrl}/clients`
  }

  salvar({
    ativo,
    codigoParticao,
    codigoService,
    dominio,
    endereco,
    fantazia,
    grupo,
    razaoSocial,
    telefone1,
    telefone2,
  }: IClientInput): Promise<Cliente> {
    return firstValueFrom(
      this.http.post(this.clienteUrl, {
        ativo,
        codigoParticao,
        codigoService,
        dominio,
        endereco: {
          ...endereco,
          bairro: {
            id: endereco.bairro.id,
          },
        },
        fantazia,
        grupo: {
          id: grupo.id,
        },
        razaoSocial,
        telefone1,
        telefone2,
      })
    ).then((resp) => resp as Cliente);
  }

  update(
    id: number,
    {
      ativo,
      codigoParticao,
      codigoService,
      dominio,
      endereco,
      fantazia,
      grupo,
      razaoSocial,
      telefone1,
      telefone2,
    }: IClientInput
  ): Promise<Cliente> {
    return firstValueFrom(
      this.http.put(`${this.clienteUrl}/${id}`, {
        ativo,
        codigoParticao,
        codigoService,
        dominio,
        endereco: {
          ...endereco,
          bairro: {
            id: endereco.bairro.id,
          },
        },
        fantazia,
        grupo: {
          id: grupo.id,
        },
        razaoSocial,
        telefone1,
        telefone2,
      })
    ).then((resp) => resp as Cliente);
  }

  excluir(codigo: number): Promise<any> {
    return firstValueFrom(
      this.http.delete(`${this.clienteUrl}/${codigo}`)
    ).then(() => null);
  }

  pesquisar(filtro: FiltroCliente): Promise<Resultado<Cliente>> {
    const params = this.createUrlParams(filtro);
    return firstValueFrom(this.http.get(this.clienteUrl, { params })).then(
      (resp: any) => {
        return new Resultado<Cliente>(
          resp.totalElements,
          resp.first,
          resp.content
        );
      }
    );
  }

  pesquisaPorCodigo(codigo: number): Promise<Cliente> {
    return firstValueFrom(this.http.get(`${this.clienteUrl}/${codigo}`)).then(
      (resp) => resp as Cliente
    );
  }

  pesquisarPorFantazia(value: any): Promise<Resultado<Cliente>> {
    const params = new HttpParams();
    params.append('fantazia', value);
    return firstValueFrom(this.http.get(this.clienteUrl, { params })).then(
      (resp: any) =>
        new Resultado<Cliente>(resp.totalElements, resp.first, resp.content)
    );
  }

  generateUploadUrl({ clientId, fileName, contentType }: IFileUploadData): Promise<IUploadURLResponse> {
    return firstValueFrom(this.http.post(`${this.clientUrlV2}/${clientId}/files/upload`, { fileName, contentType }))
    .then(response => response as IUploadURLResponse)
  }

  getAllFiles(clientId: number): Promise<FileDTO[]> {
    return firstValueFrom(this.http.get(`${this.clientUrlV2}/${clientId}/files`))
    .then(result => result as FileDTO[]);
  }

  private createUrlParams(filtro: FiltroCliente): HttpParams {
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
    if (filtro.ativo !== null) {
      params = params.set('ativo', filtro.ativo.toString());
    }
    if (filtro.tipoFiltro) {
      switch (filtro.tipoFiltro) {
        case 1: {
          params = params.set('service', filtro.descricao);
          break;
        }
        case 2: {
          params = params.set('codigoParticao', filtro.descricao);
          break;
        }
        case 3: {
          params = params.set('razaoSocial', filtro.descricao);
          break;
        }
        case 4: {
          params = params.set('fantazia', filtro.descricao);
          break;
        }
        case 5: {
          params = params.set('dominio', filtro.descricao);
          break;
        }
        case 6: {
          params = params.set('endereco', filtro.descricao);
          break;
        }
        default: {
          break;
        }
      }
    }
    return params;
  }
}
