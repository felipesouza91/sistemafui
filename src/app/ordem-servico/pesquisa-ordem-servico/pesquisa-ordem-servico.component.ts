import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, Input, ViewChild } from '@angular/core';

import {
  LazyLoadEvent,
  ConfirmationService,
  MessageService,
} from 'primeng/api';
import { Cliente } from '../../core/mode';
import {
  FiltroOrdemServico,
  OrdemServicoService,
} from '../ordem-servico.service';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { AuthService } from 'src/app/seguranca/auth.service';
import { Table } from 'primeng/table';
import { OrdemServico } from './../../core/mode';
import { format, Locale } from 'date-fns';

@Component({
  selector: 'app-pesquisa-ordem-servico',
  templateUrl: './pesquisa-ordem-servico.component.html',
  styleUrls: ['./pesquisa-ordem-servico.component.css'],
})
export class PesquisaOrdemServicoComponent implements OnInit {
  @Input() cliente!: Cliente;
  rows = 5;
  first = 0;
  calendarPtBr = {
    firstDayOfWeek: 0,
    dayNames: [
      'Domingo',
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado',
    ],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    monthNames: [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ],
    monthNamesShort: [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ],
    today: 'Hoje',
    clear: 'Limpar',
  };
  display = false;
  form!: FormGroup;
  ordem: any;
  totalElementos = 0;
  filtro: FiltroOrdemServico = {} as FiltroOrdemServico;
  prioridade = [
    { label: 'Normal', value: 'Normal' },
    { label: 'Alta', value: 'Alta' },
    { label: 'Prioridade', value: 'Prioridade' },
  ];

  filtors = [
    { value: 1, label: 'Codigo da Ordem Service' },
    { value: 2, label: 'Nome Fantazia' },
    { value: 3, label: 'Motivo da Ordem de Serviço' },
    { value: 4, label: 'Solicitante' },
    { value: 5, label: 'Prioridade' },
    { value: 6, label: 'Data de Aberutra' },
  ];

  ors: OrdemServico[] = [];

  constructor(
    public auth: AuthService,
    private errorService: ErrorHandlerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private ordemService: OrdemServicoService
  ) {}

  ngOnInit() {
    if (this.cliente) {
      this.filtro.codigoCliente = this.cliente.id;
    }
    this.criaFormulario();
  }

  criaFormulario() {
    this.form = new FormGroup({
      tipoFiltro: new FormControl(),
      descricao: new FormControl(),
      dataDe: new FormControl(null),
      dataAte: new FormControl(null),
    });
  }

  confirmarExclusao(os: any) {
    this.confirmationService.confirm({
      message: 'Deseja excluir a ordem selecionada ?',
      accept: () => {
        this.excluir(os.id);
      },
    });
  }

  excluir(codigoOs: number) {
    this.ordemService
      .excluir(codigoOs)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Ordem excluida com sucesso!',
        });
        this.pesquisar();
      })
      .catch((error) => this.errorService.handler(error));
  }

  pesquisar(pagina = 0) {
    this.filtro.tipoFiltro = this.form.value.tipoFiltro;
    this.filtro.page = pagina;
    this.filtro.size = this.rows;
    this.filtro.descricao = this.form.value.descricao;
    //this.filtro.dataAberturaDe = format(this.form.value.dataDe, 'yyyy-MM-dd');
    //this.filtro.dataAberturaAte = this.temData()!;
    this.ordemService
      .pesquisar(this.filtro)
      .then((resp) => {
        this.totalElementos = resp.total;
        this.ors = resp.conteudo;
      })
      .catch((error) => this.errorService.handler(error));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    this.rows = event.rows!;
    const pagina = event.first! / event.rows!;
    this.pesquisar(pagina);
  }

  finalizou(tipo: boolean) {
    this.display = !tipo;
    this.first = 0;
    this.pesquisar();
  }

  showDialog(os?: any) {
    this.display = !this.display;
    this.ordem = os;
    this.form.reset();
  }

  temData(): string | null {
    return this.form.value.dataAte != null
      ? format(this.form.value.dataAte, 'dd-MM-yyyy')
      : null;
  }

  onChangeFilterOption() {
    this.form.reset();
  }
}
