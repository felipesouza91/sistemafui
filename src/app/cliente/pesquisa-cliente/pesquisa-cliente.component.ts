import { AuthService } from './../../seguranca/auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { FiltroCliente, ClienteService } from '../cliente.service';
import { LazyLoadEvent, ConfirmationService } from 'primeng/api';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Cliente } from './../../core/mode';

@Component({
  selector: 'app-pesquisa-cliente',
  templateUrl: './pesquisa-cliente.component.html',
  styleUrls: ['./pesquisa-cliente.component.css'],
})
export class PesquisaClienteComponent implements OnInit, AfterViewInit {
  @ViewChild('tab', { static: true }) tabela!: Table;
  filtro: FiltroCliente = {} as FiltroCliente;
  formPesquisa!: FormGroup;
  expanded = false;
  totalElementos = 0;
  status = [
    { value: true, label: 'Ativo' },
    { value: false, label: 'Desativo' },
  ];

  filtroOptions = [
    { value: 0, label: 'Todos' },
    { value: 1, label: 'Codigo Service' },
    { value: 2, label: 'Codigo Sigma' },
    { value: 3, label: 'Razão Social' },
    { value: 4, label: 'Nome Fantasia' },
    { value: 5, label: 'Dominio' },
    { value: 6, label: 'Endereço' },
  ];

  clientes: Cliente[] = [];

  constructor(
    public auth: AuthService,
    private erroHandler: ErrorHandlerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private clienteService: ClienteService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.criarFormulario();
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  remover(cliente: any) {
    this.confirmationService.confirm({
      message: `Deseja excluir o cliente: ${cliente.fantazia}?`,
      accept: () => {
        this.clienteService
          .excluir(cliente.id)
          .then(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Cliente excluido com sucesso!',
            });
            this.formPesquisa.reset();
            this.pesquisar();
            this.tabela.first = 0;
          })
          .catch((error) => this.erroHandler.handler(error));
      },
    });
  }

  pesquisar(pagina = 0) {
    this.filtro.tipoFiltro = this.formPesquisa.value.tipoFiltro;
    this.filtro.descricao = this.formPesquisa.value.descricao;
    this.filtro.ativo = this.formPesquisa.value.ativo;
    this.filtro.page = pagina;
    this.filtro.size = this.tabela.rows;
    this.clienteService
      .pesquisar(this.filtro)
      .then((resp) => {
        this.totalElementos = resp.total;
        this.clientes = resp.conteudo;
        if (resp.firstPage && this.tabela.first > 1) {
          this.tabela.first = 0;
        }
      })
      .catch((error) => this.erroHandler.handler(error));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first! / event.rows!;
    this.pesquisar(pagina);
  }

  criarFormulario(tipoFiltro = 0) {
    this.formPesquisa = new FormGroup({
      ativo: new FormControl(true),
      tipoFiltro: new FormControl(tipoFiltro),
      descricao: new FormControl(null),
    });
  }

  resertDescricao(event: any) {
    this.criarFormulario(event.value);
  }
}
