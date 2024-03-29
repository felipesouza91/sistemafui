import { Atendimento } from 'src/app/core/mode';

import { AtendimentoService } from './../atendimento.service';
import { AuthService } from './../../seguranca/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';

import { format } from 'date-fns';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { ClienteService } from './../../cliente/cliente.service';
import { MessageService } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import { Cliente } from './../../core/mode';

interface SearchEvent {
  query: string;
}

@Component({
  selector: 'app-cadastro-atendimento',
  templateUrl: './cadastro-atendimento.component.html',
  styleUrls: ['./cadastro-atendimento.component.css'],
})
export class CadastroAtendimentoComponent implements OnInit {
  listCliente: Cliente[] = [];
  formAt!: FormGroup;
  solucao = false;
  @ViewChild('panel', { static: true }) panel!: Dialog;
  @Input() atendimentoId!: number;
  @Input() display = false;
  @Output() closed = new EventEmitter<boolean>();

  constructor(
    public auth: AuthService,
    private messageService: MessageService,
    private clienteService: ClienteService,
    private atendimentoService: AtendimentoService,
    private erroService: ErrorHandlerService
  ) {}

  ngOnInit() {
    if (this.atendimentoId) {
      this.atendimentoService.getById(this.atendimentoId).then((response) => {
        console.log(response);
      });
    }
    this.criarForm();
  }

  criar() {}

  inicio() {
    this.solucao = true;
    const atendimento = this.formAt.getRawValue();

    atendimento.dataInicio = format(
      atendimento.dataInicio,
      'YYYY-MM-DD HH:mm:ss'
    );
    this.atendimentoService
      .salvar(atendimento)
      .then((resp) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Atendimento iniciado com sucesso !`,
        });
        this.formAt.patchValue(resp);
        this.formAt.get('cliente')!.setValue(resp.cliente);
      })
      .catch((error) => this.erroService.handler(error));
  }

  finalizar() {
    this.formAt.addControl(
      'usuarioTermino',
      new FormGroup({
        id: new FormControl(this.auth.jwtPayload.id),
      })
    );
    const atendimento = this.formAt.getRawValue();
    atendimento.dataInicio = format(
      atendimento.dataInicio,
      'YYYY-MM-DD HH:mm:ss'
    );
    atendimento.dataTermino = format(new Date(), 'YYYY-MM-DD HH:mm:ss');
    this.atendimentoService
      .atualizar(atendimento)
      .then((resp) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Atendimento finalizado com sucesso !`,
        });
        this.panel.visible = false;
        this.formAt.reset();
      })
      .catch((error) => this.erroService.handler(error));
  }

  filtroCliente(event: SearchEvent) {
    this.clienteService
      .pesquisarPorFantazia(event.query)
      .then((resp) => {
        this.listCliente = resp.conteudo;
      })
      .catch((error) => this.erroService.handler(error));
  }

  fechado() {
    this.closed.emit(false);
  }

  criarForm() {
    this.formAt = new FormGroup({
      id: new FormControl(),
      cliente: new FormControl(Validators.required),
      solicitante: new FormControl(null, Validators.required),
      dataInicio: new FormControl({ value: new Date(), disabled: true }),
      descricaoProblema: new FormControl(null, Validators.required),
      descricaoSolucao: new FormControl(null),
      dataTermino: new FormControl({ value: null, disabled: true }),
      usuarioInicio: new FormGroup({
        id: new FormControl(this.auth.jwtPayload.id),
        nome: new FormControl({
          value: this.auth.jwtPayload.nome,
          disabled: true,
        }),
      }),
    });
  }
}
