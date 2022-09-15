import { AuthService } from './../../seguranca/auth.service';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { Fabricante } from './../../core/mode';
import { MessageService } from 'primeng/api';
import { FabricanteService, FabricanteFilter } from './../fabricante.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-fabricante',
  templateUrl: './fabricante.component.html',
  styleUrls: ['./fabricante.component.css'],
})
export class FabricanteComponent implements OnInit {
  fabricantes: any = [];
  totalRegistros!: number;
  size!: number;
  rows = 5;
  first = 0;
  fabricanteSelect!: Fabricante | undefined;
  filter: FabricanteFilter = {} as FabricanteFilter;
  new = false;
  form!: FormGroup;
  formPes!: FormGroup;
  constructor(
    public auth: AuthService,
    private confirmatioService: ConfirmationService,
    private messageService: MessageService,
    private fabricanteService: FabricanteService,
    private erroHandler: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.initForm();
    this.initFormSearch();
  }

  save() {
    if (this.fabricanteSelect) {
      this.update();
    } else {
      this.create();
    }
    this.form.reset();
  }

  create() {
    this.fabricanteService
      .save(this.form.value)
      .then((resp) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucessao',
          detail: 'Fabricante cadastrado com sucesso',
        });
        this.new = false;
        this.pesquisar(this.first / this.rows);
      })
      .catch((error) => this.erroHandler.handler(error));
  }

  update() {
    this.fabricanteService
      .update(this.fabricanteSelect!.id, this.form.value)
      .then((restp) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucessao',
          detail: 'Fabricante atualizado com sucesso',
        });
        this.new = false;
        this.pesquisar(this.first / this.rows);
        this.fabricanteSelect = undefined;
      })
      .catch((error) => this.erroHandler.handler(error));
  }

  preDelete(id: number) {
    this.confirmatioService.confirm({
      message: `Deseja excluir o fabricante selecionado ?`,
      accept: () => {
        this.delete(id);
      },
    });
  }

  delete(id: number) {
    this.fabricanteService
      .delete(id)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucessao',
          detail: 'Fabricante excluido com sucesso',
        });
        this.pesquisar(this.first / this.rows);
      })
      .catch((error) => this.erroHandler.handler(error));
  }

  edit(fab: Fabricante) {
    this.fabricanteSelect = fab;
    this.form.patchValue(fab);
    this.new = true;
  }

  aoMudarPagina(event: LazyLoadEvent) {
    this.rows = event.rows!;
    this.first = event.first!;
    const pagina = event.first! / event.rows!;
    this.pesquisar(pagina);
  }

  pesquisar(pagina = 0) {
    this.filter.descricao = this.formPes.value.descricao;
    this.filter.page = pagina;
    this.filter.size = this.rows;
    this.fabricanteService
      .findAll(this.filter)
      .then((result) => {
        this.fabricantes = result.conteudo;
        this.totalRegistros = result.total;
      })
      .catch((error) => this.erroHandler.handler(error));
  }

  private initForm() {
    this.form = new FormGroup({
      descricao: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255),
      ]),
    });
  }

  private initFormSearch() {
    this.formPes = new FormGroup({
      descricao: new FormControl(),
    });
  }
}
