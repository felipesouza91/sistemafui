import { AuthService } from './../../seguranca/auth.service';
import { ConfirmationService } from 'primeng/api';
import { Fabricante } from './../../core/mode';
import { MessageService } from 'primeng/api';
import { FabricanteService, FabricanteFilter } from './../fabricante.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';

@Component({
  selector: 'app-fabricante',
  templateUrl: './fabricante.component.html',
  styleUrls: ['./fabricante.component.css'],
})
export class FabricanteComponent implements OnInit {
  fabricantes: any = [];
  totalRegistros: number;
  size: number;
  @ViewChild('tab', { static: true }) tabela;
  fabricanteSelect: Fabricante;
  filter = new FabricanteFilter();
  new = false;
  form: FormGroup;
  formPes: FormGroup;
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
        this.pesquisar();
      })
      .catch((error) => this.erroHandler.handler(error));
  }

  update() {
    this.fabricanteService
      .update(this.fabricanteSelect.id, this.form.value)
      .then((restp) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucessao',
          detail: 'Fabricante atualizado com sucesso',
        });
        this.new = false;
        this.pesquisar();
        this.fabricanteSelect = null;
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
        this.pesquisar();
      })
      .catch((error) => this.erroHandler.handler(error));
  }

  edit(fab: Fabricante) {
    this.fabricanteSelect = fab;
    this.form.patchValue(fab);
    this.new = true;
  }

  aoMudarPagina(event) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  pesquisar(pagina = 0) {
    this.filter.descricao = this.formPes.value.descricao;
    this.filter.page = pagina;
    this.filter.size = this.tabela.rows;
    this.fabricanteService
      .findAll(this.filter)
      .then((result) => {
        this.fabricantes = result.conteudo;
        this.totalRegistros = result.total;
        if (result.firstPage && this.tabela.first > 1) {
          this.tabela.first = 0;
        }
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
