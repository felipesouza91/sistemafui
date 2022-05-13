import { AuthService } from './../../seguranca/auth.service';

import { FiltroMotivoOs, MotivoOsService } from '../motivo-os.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { MessageService, LazyLoadEvent } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-motivoos',
  templateUrl: './motivoos.component.html',
  styleUrls: ['./motivoos.component.css'],
})
export class MotivoosComponent implements OnInit {
  @ViewChild('tab', { static: true }) tabela;
  opt = false;
  filtro = new FiltroMotivoOs();
  form: FormGroup;
  totalElementos = 0;
  motivosOs = [];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private motivoOsService: MotivoOsService
  ) {}

  ngOnInit() {
    this.confFormulario(this.opt);
  }

  criar() {
    if (this.form.value.id) {
      this.editar();
    } else {
      this.salvar();
    }
  }

  salvar() {
    this.motivoOsService
      .salvar(this.form.value)
      .then((rep) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Motivo de Ordem Serviço cadastrado com sucesso!',
        });
        this.ajust();
      })
      .catch((error) => this.errorHandler.handler(error));
  }

  editar() {
    this.motivoOsService
      .editar(this.form.value.id, this.form.value)
      .then((rep) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Motivo de Ordem Serviço atualizado com sucesso!',
        });
        this.ajust();
      })
      .catch((error) => this.errorHandler.handler(error));
  }

  confirmaExclusao(motivo: any) {
    this.confirmationService.confirm({
      message: `Deseja excluir o motivo de ordem de servico: ${motivo.descricao}`,
      accept: () => {
        this.excluir(motivo.id);
      },
    });
  }

  excluir(codigo: number) {
    this.motivoOsService
      .excluir(codigo)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Motivo de Ordem Serviço excluido com sucesso!',
        });
        this.pesquisar();
      })
      .catch((error) => this.errorHandler.handler(error));
  }

  pesquisar(pagina = 0) {
    this.filtro.descricao = this.form.value.descricao;
    this.filtro.page = pagina;
    this.motivoOsService
      .pesquisar(this.filtro)
      .then((resp) => {
        this.totalElementos = resp.total;
        this.motivosOs = resp.conteudo;
        if (resp.firstPage && this.tabela.first > 1) {
          this.tabela.first = 0;
        }
      })
      .catch((error) => this.errorHandler.handler(error));
  }

  confFormulario(tipo: boolean) {
    if (tipo) {
      this.form = new FormGroup({
        id: new FormControl(),
        descricao: new FormControl(null, [
          Validators.required,
          Validators.maxLength(70),
          Validators.minLength(10),
        ]),
      });
    } else {
      this.form = new FormGroup({
        descricao: new FormControl(null),
      });
    }
    this.opt = tipo;
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  prencheFormulario(motivoos: any, tipo: boolean) {
    this.confFormulario(tipo);
    this.form.setValue(motivoos);
  }

  private ajust() {
    this.form.reset();
    this.pesquisar();
    this.confFormulario(false);
  }
}
