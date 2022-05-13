import { AuthService } from './../../seguranca/auth.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Informacao } from 'src/app/core/mode';

import { Cliente } from './../../core/mode';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { InformacaoService, InformacaoFilter } from './../informacao.service';

import { LazyLoadEvent } from 'primeng/api';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-lista-informacao',
  templateUrl: './lista-informacao.component.html',
  styleUrls: ['./lista-informacao.component.css'],
})
export class ListaInformacaoComponent implements OnInit {
  @Input() cliente: Cliente;
  idInfo: number;
  display = false;
  @ViewChild('tab', { static: true }) tabela;
  list: Informacao[];
  filtro = new InformacaoFilter();
  totalElementos = 0;
  constructor(
    public auth: AuthService,
    private informacaoService: InformacaoService,
    private erroHandler: ErrorHandlerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {}

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  showDialog(idInfor?: number) {
    this.idInfo = idInfor;
    this.display = !this.display;
  }

  pesquisar(pagina = 0) {
    this.filtro.idCliente = this.cliente.id;
    this.filtro.page = pagina;
    this.filtro.size = this.tabela.rows;
    this.informacaoService
      .findAll(this.filtro)
      .then((resp) => {
        this.totalElementos = resp.total;
        this.list = resp.conteudo;
        if (resp.firstPage && this.tabela.first > 1) {
          this.tabela.first = 0;
        }
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
        this.tabela.first = 0;
      })
      .catch((error) => this.erroHandler.handler(error));
  }

  fechou(event: boolean) {
    this.display = !event;
    this.tabela.first = 0;
    this.pesquisar();
  }
}
