import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { AuthService } from './../../seguranca/auth.service';
import { DvrService, FiltroDvr } from '../dvr.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-tabela-dvr',
  templateUrl: './tabela-dvr.component.html',
  styleUrls: ['./tabela-dvr.component.css'],
})
export class TabelaDvrComponent implements OnInit {
  @Input() idCliente: number;
  @ViewChild('tabela', { static: true }) tabela: Table;
  display = false;
  totalElementos = 0;
  filtro = new FiltroDvr();
  dvrs = [];
  dvr: any;

  constructor(
    public auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private messageService: MessageService,
    private confirmationDialog: ConfirmationService,
    private dvrService: DvrService
  ) {}

  ngOnInit() {}

  showDialog(dvr: any = null) {
    this.dvr = dvr;
    this.display = !this.display;
  }

  finalizou(tipo: Boolean) {
    this.display = !tipo;
    this.pesquisar();
  }

  confirmarExclusao(codigo: number) {
    this.confirmationDialog.confirm({
      message: 'Deseja excluir o Dvr selecionado?',
      accept: () => {
        this.excluir(codigo);
      },
    });
  }

  pesquisar(pagina = 0) {
    this.filtro.codCliente = this.idCliente;

    this.filtro.page = pagina;
    this.filtro.size = this.tabela.rows;
    this.dvrService
      .pesquisar(this.filtro)
      .then((resp) => {
        this.totalElementos = resp.total;
        this.dvrs = resp.conteudo;
        if (resp.firstPage && this.tabela.first > 1) {
          this.tabela.first = 0;
        }
      })
      .catch((error) => this.errorHandler.handler(error));
  }

  excluir(codigo: number) {
    this.dvrService
      .excluir(codigo)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Dvr excluido com  sucesso!',
        });
        this.pesquisar();
      })
      .catch((error) => this.errorHandler.handler(error));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }
}
