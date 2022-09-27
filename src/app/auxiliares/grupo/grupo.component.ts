import { AuthService } from './../../seguranca/auth.service';
import { GrupoService, FiltroGrupo } from '../grupo.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { Table } from 'primeng/table';
import { Grupo } from 'src/app/core/mode';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.css'],
})
export class GrupoComponent implements OnInit {
  totalRegistros = 0;
  filtro: FiltroGrupo = {} as FiltroGrupo;
  opt = false;
  form!: FormGroup;
  grupos: Grupo[] = [];
  rows = 5;
  constructor(
    private errorHandler: ErrorHandlerService,
    public auth: AuthService,
    private messageService: MessageService,
    private confirmatioService: ConfirmationService,
    private grupoService: GrupoService
  ) {}

  ngOnInit() {
    this.configureForm(this.opt);
  }

  criar() {
    if (this.form.value.id) {
      this.editar();
    } else {
      this.salvar();
    }
    this.form.reset();
    this.pesquisar();
  }

  salvar() {
    this.grupoService
      .salvar(this.form.value)
      .then((resp) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Grupo cadastrado com sucesso',
        });
        this.configureForm(false);
      })
      .catch((error) => this.errorHandler.handler(error));
  }

  editar() {
    this.grupoService
      .atualizar(this.form.value.id, this.form.value)
      .then((resp) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Grupo atualizado com sucesso',
        });
        this.configureForm(false);
      })
      .catch((error) => this.errorHandler.handler(error));
  }

  pesquisar(pagina = 0) {
    this.filtro.nome = this.form.value.nome;
    this.filtro.page = pagina;
    this.filtro.size = this.rows;
    this.grupoService
      .pesquisar(this.filtro)
      .then((response) => {
        this.totalRegistros = response.total;
        this.grupos = response.conteudo;

      })
      .catch((error) => {
        console.log(error);
        this.errorHandler.handler(error);
      });
  }

  remover(grupo: any) {
    this.confirmatioService.confirm({
      message: `Tem certeza que deseja excluir o grupo: ${grupo.nome} ?`,
      accept: () => {
        this.excluir(grupo);
      },
    });
  }

  excluir(grupo: any) {
    this.grupoService
      .excluir(grupo.id)
      .then(() => {
        this.pesquisar();
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Grupo excluido com sucesso',
        });
      })
      .catch((error) => {
        this.errorHandler.handler(error);
      });
  }

  configureForm(tipo: boolean) {
    if (tipo) {
      this.form = new FormGroup({
        id: new FormControl(),
        nome: new FormControl(null, [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(70),
        ]),
      });
    } else {
      this.form = new FormGroup({
        id: new FormControl(),
        nome: new FormControl(null),
      });
    }
    this.opt = tipo;
  }

  prencheFormulario(grupo: any, tipo: boolean) {
    this.form.setValue(grupo);
    this.opt = tipo;
  }

  aoMudarPagina(event: LazyLoadEvent) {
    this.rows = event.rows!;
    const pagina = event.first! / event.rows!;
    this.pesquisar(pagina);
  }
}
