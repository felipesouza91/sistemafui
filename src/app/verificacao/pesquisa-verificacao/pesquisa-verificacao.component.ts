import { VerificacaoGravacao } from './../../core/mode';
import {
  LazyLoadEvent,
  ConfirmationService,
  MessageService,
} from 'primeng/api';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { Cliente } from '../../core/mode';
import {
  VerificacaoService,
  VerificaGravacaoFilter,
} from '../verificacao.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { AuthService } from 'src/app/seguranca/auth.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-pesquisa-verificacao',
  templateUrl: './pesquisa-verificacao.component.html',
  styleUrls: ['./pesquisa-verificacao.component.css'],
})
export class PesquisaVerificacaoComponent implements OnInit {
  @Input() resumo = true;
  @Input() cliente!: Cliente;
  @ViewChild('tab', { static: true }) tabela!: Table;
  idVerificacao!: number;
  filtro: VerificaGravacaoFilter = {} as VerificaGravacaoFilter;
  totalElementos = 0;
  listVerificao: VerificacaoGravacao[] = [];

  display = false;

  constructor(
    public auth: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private erroService: ErrorHandlerService,
    private verificaService: VerificacaoService
  ) {}

  ngOnInit() {
    if (this.cliente) {
      this.filtro.codigoCliente = this.cliente.id;
    }
  }

  pesquisar(pagina = 0) {
    this.filtro.page = pagina;
    this.verificaService
      .pesquisa(this.filtro, this.resumo)
      .then((resp) => {
        this.totalElementos = resp.total;
        this.listVerificao = resp.conteudo;
        if (resp.firstPage && this.tabela.first > 1) {
          this.tabela.first = 0;
        }
      })
      .catch((erro) => this.erroService.handler(erro));
  }

  confirmarExclusao(id: number) {
    this.confirmationService.confirm({
      message: 'Deseja excluir a verificação selecionado?',
      accept: () => {
        this.excluir(id);
      },
    });
  }

  excluir(id: number) {
    this.verificaService
      .excluir(id)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Verificação excluida com  sucesso!',
        });
        this.pesquisar();
      })
      .catch((error) => this.erroService.handler(error));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first! / event.rows!;
    this.pesquisar(pagina);
  }

  finalizou(tipo: Boolean) {
    this.display = !tipo;
    this.tabela.first = 0;
    this.pesquisar();
  }

  showDialog(id?: number) {
    this.idVerificacao = id!;
    this.display = !this.display;
  }
}
