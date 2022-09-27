import { AuthService } from './../../seguranca/auth.service';
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { Informacao } from 'src/app/core/mode';

import { Cliente } from './../../core/mode';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { InformacaoService, InformacaoFilter } from './../informacao.service';

import { LazyLoadEvent } from 'primeng/api';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-lista-informacao',
  templateUrl: './lista-informacao.component.html',
  styleUrls: ['./lista-informacao.component.css'],
})
export class ListaInformacaoComponent implements OnInit {
  @Input() cliente!: Cliente;
  idInfo!: number;
  display = false;
  list: Informacao[] = [];
  filtro: InformacaoFilter = {} as InformacaoFilter;
  totalElementos = 0;
  rows = 5;
  first = 0;

  constructor(
    public auth: AuthService,
    private informacaoService: InformacaoService,
    private erroHandler: ErrorHandlerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {}

  aoMudarPagina(event: LazyLoadEvent) {
    this.rows = event.rows!;

    const pagina = event.first! / event.rows!;
    this.pesquisar(pagina);
  }

  showDialog(idInfor?: number) {
    this.idInfo = idInfor!;
    this.display = !this.display;
  }

  pesquisar(pagina = 0) {
    this.filtro.idCliente = this.cliente.id;
    this.filtro.page = pagina;
    this.filtro.size = this.rows;
    this.informacaoService
      .findAll(this.filtro)
      .then((resp) => {
        this.totalElementos = resp.total;
        this.list = resp.conteudo;
      })
      .catch((error) => this.erroHandler.handler(error));
  }

  confirmarExclusao(idInfo: number) {
    this.confirmationService.confirm({
      message: `Deseja excluir a informação: ${idInfo}?`,
      accept: () => {
        this.remove(idInfo);
      },
    });
  }

  remove(infoId: number) {
    this.informacaoService
      .delete(this.cliente.id, infoId)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Informação excluida com sucesso!',
        });
        this.pesquisar();
        this.first = 0;
      })
      .catch((error) => this.erroHandler.handler(error));
  }

  fechou(event: Boolean) {
    this.display = !event;
    this.pesquisar(Math.floor(this.totalElementos / this.rows));
    this.first = this.totalElementos;
  }
}
