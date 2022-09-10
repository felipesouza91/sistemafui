import { Cliente } from './../../core/mode';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';

import { MessageService } from 'primeng/api';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { InformacaoService } from './../informacao.service';
import { AuthService } from './../../seguranca/auth.service';
import { Panel } from 'primeng/panel';

@Component({
  selector: 'app-cadastro-informacao',
  templateUrl: './cadastro-informacao.component.html',
  styleUrls: ['./cadastro-informacao.component.css'],
})
export class CadastroInformacaoComponent implements OnInit {
  @Input() display!: boolean;
  @Input() idInfo!: number;
  @ViewChild('panel', { static: true }) painel!: Panel;
  @Input() cliente!: Cliente;
  @Output() closed = new EventEmitter<Boolean>();
  form!: FormGroup;
  constructor(
    public auth: AuthService,
    private informacaoService: InformacaoService,
    private erroHandler: ErrorHandlerService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.initForm();
    if (this.idInfo) {
      this.loadInformacao(this.idInfo);
    }
  }

  save() {
    if (this.idInfo) {
      this.update();
    } else {
      this.novo();
    }
  }

  novo() {
    this.informacaoService
      .save(this.cliente.id, this.form.value)
      .then((resp) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Informação cadastrada com sucesso!`,
        });
        this.display = false;
        this.initForm();
      })
      .catch((error) => this.erroHandler.handler(error));
  }

  update() {
    this.informacaoService
      .update(this.cliente.id, this.idInfo, this.form.value)
      .then((resp) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Informação atualizada com sucesso!`,
        });
        this.display = false;
        this.initForm();
      })
      .catch((error) => this.erroHandler.handler(error));
  }

  initForm() {
    this.form = new FormGroup({
      cliente: new FormControl(
        { value: this.cliente.fantazia, disabled: true },
        [Validators.required]
      ),
      descricao: new FormControl(null, [Validators.required]),
      creationDate: new FormControl({ value: new Date(), disabled: true }),
      createdBy: new FormGroup({
        id: new FormControl({ value: this.auth.jwtPayload.id, disabled: true }),
        nome: new FormControl({
          value: this.auth.jwtPayload.nome,
          disabled: true,
        }),
      }),
    });
  }

  loadInformacao(idInfo: number) {
    this.informacaoService
      .findById(this.cliente.id, idInfo)
      .then((resp) => {
        this.form.patchValue(resp);
      })
      .catch((error) => {
        this.erroHandler.handler(error);
      });
  }

  fechado() {
    this.closed.emit(true);
  }
}
