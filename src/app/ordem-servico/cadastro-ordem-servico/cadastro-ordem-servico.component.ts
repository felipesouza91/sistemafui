import { AuthService } from './../../seguranca/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';

import { MessageService } from 'primeng/api';
import { format } from 'date-fns';
import {
  MotivoOsService,
  FiltroMotivoOs,
} from '../../auxiliares/motivo-os.service';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { OrdemServicoService } from '../ordem-servico.service';
import { OrdemServico, Cliente, MotivoOs } from '../../core/mode';
import { ClienteService, FiltroCliente } from '../../cliente/cliente.service';
import { Panel } from 'primeng/panel';

interface IValueDropdown<T> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-cadastro-ordem-servico',
  templateUrl: './cadastro-ordem-servico.component.html',
  styleUrls: ['./cadastro-ordem-servico.component.css'],
})
export class CadastroOrdemServicoComponent implements OnInit {
  formOs!: FormGroup;
  @ViewChild('panel', { static: true }) painel!: Panel;
  @Input() display!: boolean;
  @Input() cliente!: Cliente;
  @Input() os!: number;
  @Output() closed = new EventEmitter<boolean>();
  motivosOss: IValueDropdown<MotivoOs>[] = [];
  listCliente!: Array<Cliente>;
  listMotivoOs: MotivoOs[] = [];
  osBuscada: OrdemServico = {} as OrdemServico;

  prioridades = [
    { value: 'NORMAL', label: 'NORMAL' },
    { value: 'ALTA', label: 'ALTA' },
    { value: 'PRIORIDADE', label: 'PRIORIDADE' },
  ];

  constructor(
    public auth: AuthService,
    private erroService: ErrorHandlerService,
    private messageService: MessageService,
    private clienteService: ClienteService,
    private motivoService: MotivoOsService,
    private ordemService: OrdemServicoService
  ) {}

  ngOnInit() {
    this.criarFormulario();
    if (this.os) {
      this.carregarOs(this.os);
      this.formOs.get('cliente')!.disable();
    }
    if (this.cliente) {
      this.formOs.get('cliente')!.setValue(this.cliente);
      this.formOs.get('cliente')!.disable();
    }
  }

  criarFormulario() {
    this.formOs = new FormGroup({
      id: new FormControl(null),
      codigoService: new FormControl(null),
      codigoSigma: new FormControl(null),
      solicitante: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(255),
      ]),
      prioridadeOs: new FormControl(null, Validators.required),
      dvr: new FormControl(null),
      motivoOs: new FormControl(null, Validators.required),
      descricao: new FormControl(null, Validators.required),
      cliente: new FormControl(null, Validators.required),
      dataAbertura: new FormControl({ value: new Date(), disabled: true }),
      fechado: new FormControl(null),
    });
  }

  criar() {
    if (this.os) {
      this.atualizar();
    } else {
      this.novo();
    }
  }

  novo() {
    const ordemServico = this.formOs.getRawValue();
    ordemServico.dataAbertura = format(
      ordemServico.dataAbertura,
      'YYYY-MM-DD HH:mm:ss'
    );
    this.ordemService
      .salvar(ordemServico)
      .then((resp) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Ordem de serviço cadastrada sobre o número: ${resp.id}!`,
        });
        this.display = false;
        this.criarFormulario();
      })
      .catch((erro) => this.erroService.handler(erro));
  }

  atualizar() {
    const ordemServico = this.formOs.getRawValue();
    ordemServico.dataAbertura = format(
      ordemServico.dataAbertura,
      'YYYY-MM-DD HH:mm:ss'
    );
    this.ordemService
      .editar(this.os, ordemServico)
      .then((resp) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Ordem de serviço atualizada com suscesso!`,
        });
        this.display = false;
        this.criarFormulario();
      })
      .catch((error) => this.erroService.handler(error));
  }

  filtroMotivoOs(event: { query: string }) {
    const filtro: FiltroMotivoOs = {} as FiltroMotivoOs;
    filtro.descricao = event.query;
    filtro.size = 2000;
    this.motivoService
      .pesquisar(filtro)
      .then((resp) => {
        this.listMotivoOs = resp.conteudo;
      })
      .catch((error) => this.erroService.handler(error));
  }

  filtroCliente(event: { query: string }) {
    const filter: FiltroCliente = {} as FiltroCliente;
    filter.ativo = true;
    if (parseInt(event.query)) {
      filter.tipoFiltro = 1;
      filter.descricao = event.query;
    } else {
      filter.tipoFiltro = 4;
      filter.descricao = event.query;
    }
    this.clienteService
      .pesquisar(filter)
      .then((resp) => {
        this.listCliente = resp.conteudo;
      })
      .catch((error) => this.erroService.handler(error));
  }

  private initMotivoOs() {
    this.motivoService
      .pesquisarTodos()
      .then((resp) => {
        this.motivosOss = resp.map((r) => ({ label: r.descricao, value: r }));
      })
      .catch((erro) => this.erroService.handler(erro));
  }

  carregarOs(os: number) {
    this.ordemService
      .buscarPorCodigo(this.os)
      .then((resp) => {
        this.cliente = resp.cliente;
        this.formOs.patchValue(resp);
      })
      .catch((error) => this.erroService.handler(error));
  }

  fechado() {
    this.closed.emit(true);
  }
}
