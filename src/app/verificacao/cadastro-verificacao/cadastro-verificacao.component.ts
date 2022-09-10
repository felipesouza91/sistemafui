import { MessageService } from 'primeng/api';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import * as moment from 'moment';

import { AuthService } from './../../seguranca/auth.service';
import { Cliente } from '../../core/mode';
import { VerificacaoService } from './../verificacao.service';
import { DvrService } from './../../dvr/dvr.service';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { Panel } from 'primeng/panel';

interface IDropdown {
  label: string;
  value: { id: number };
}

@Component({
  selector: 'app-cadastro-verificacao',
  templateUrl: './cadastro-verificacao.component.html',
  styleUrls: ['./cadastro-verificacao.component.css'],
})
export class CadastroVerificacaoComponent implements OnInit {
  form!: FormGroup;
  @ViewChild('panelV', { static: true }) painel!: Panel;
  @Input() cliente!: Cliente;
  @Input() display: boolean = false;
  @Input() verificacao!: number;
  @Output() closed = new EventEmitter<Boolean>();

  dvrs: IDropdown[] = [];
  status = [
    { label: 'Online', value: 'ONLINE' },
    { label: 'Offline', value: 'OFFLINE' },
  ];
  hds = [
    { label: 'GB', value: 'GB' },
    { label: 'TB', value: 'TB' },
  ];
  constructor(
    public auth: AuthService,
    private erroService: ErrorHandlerService,
    private messageService: MessageService,
    private dvrService: DvrService,
    private verificaService: VerificacaoService
  ) {}

  ngOnInit() {
    this.initForm();
    if (this.verificacao) {
      this.carregarVerificacao(this.verificacao);
    } else {
      this.preencheListaDvr();
    }
  }

  criar() {
    if (this.verificacao) {
      this.editar();
    } else {
      this.novo();
    }
  }

  novo() {
    const verificacao = this.form.getRawValue();
    verificacao.dataTeste = moment(verificacao.dataAbertura).format(
      'YYYY-MM-DD HH:mm:ss'
    );
    this.verificaService
      .salvar(verificacao)
      .then((resp) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Verificação atualizada com sucesso !`,
        });
        this.display = false;
        this.initForm();
      })
      .catch((erro) => this.erroService.handler(erro));
  }

  editar() {
    const verificacao = this.form.getRawValue();
    verificacao.dataTeste = moment(verificacao.dataTeste).format(
      'YYYY-MM-DD HH:mm:ss'
    );
    this.verificaService
      .atualizar(this.verificacao, verificacao)
      .then((resp) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Verificação cadastrada sobre o número: ${resp.id} !`,
        });
        this.display = false;
        this.initForm();
      })
      .catch((erro) => this.erroService.handler(erro));
  }

  initForm() {
    this.form = new FormGroup({
      id: new FormControl(),
      status: new FormControl(null, Validators.required),
      hd: new FormControl(null, Validators.required),
      qtdGravacao: new FormControl(null, Validators.required),
      dataTeste: new FormControl({ value: new Date(), disabled: true }),
      dvr: new FormControl(null, Validators.required),
      usuario: new FormGroup({
        id: new FormControl(this.auth.jwtPayload.id),
        nome: new FormControl({
          value: this.auth.jwtPayload.nome,
          disabled: true,
        }),
      }),
    });
  }

  fechado() {
    this.closed.emit(true);
  }

  preencheListaDvr() {
    this.dvrService.buscarPorCodigoCliente(this.cliente.id).then((resp) => {
      resp.map((r) => {
        this.dvrs.push({
          label: `${r.fabricante} - ${r.modeloDvr}`,
          value: { id: r.id },
        });
      });
    });
  }

  carregarVerificacao(id: number) {
    this.verificaService.buscarPorCodigo(id).then((resp) => {
      this.dvrs.push({
        label: `${resp.dvr.fabricante} - ${resp.dvr.modeloDvr}`,
        value: resp.dvr,
      });
      this.form.patchValue(resp);
    });
  }
}
