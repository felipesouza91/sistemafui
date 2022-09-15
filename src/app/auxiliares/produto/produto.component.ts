import { FabricanteService, FabricanteFilter } from './../fabricante.service';

import { ProdutoService, ProdutoFilter } from './../produto.service';
import { AuthService } from './../../seguranca/auth.service';
import {
  LazyLoadEvent,
  MessageService,
  ConfirmationService,
} from 'primeng/api';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormControlName,
} from '@angular/forms';
import { Produto } from 'src/app/core/mode';
import { Fabricante } from './../../core/mode';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ProdutoComponent implements OnInit {
  filtros = [
    { label: 'Todos' },
    { label: 'Fabricante', value: 1 },
    { label: 'Modelo', value: 2 },
  ];
  produtos: Produto[] = [];
  fabricantes: Fabricante[] = [];
  totalRegistros!: number;
  filtro: ProdutoFilter = {} as ProdutoFilter;
  form!: FormGroup;
  rows = 5;
  formCad!: FormGroup;
  filterFab: FabricanteFilter = {} as FabricanteFilter;
  showCreateDialog = false;
  produtoSelect!: Produto;
  first = 0;
  constructor(
    public auth: AuthService,
    private produtoService: ProdutoService,
    private fabricanteService: FabricanteService,
    private confirmationDialog: ConfirmationService,
    private messageService: MessageService,
    private erroHandler: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  save() {
    if (this.produtoSelect) {
      this.update();
    } else {
      this.create();
    }
  }

  edit(produto: Produto) {
    this.produtoSelect = produto;
    this.formCad.patchValue(produto);
    this.showCreateDialog = true;
  }

  preDelete(id: number) {
    this.confirmationDialog.confirm({
      message: `Deseja excluir o fabricante selecionado ?`,
      accept: () => {
        this.delete(id);
      },
    });
  }

  create() {
    this.produtoService
      .save(this.formCad.value)
      .then((resp) => {
        this.postPersit('cadastrado');
      })
      .catch((error) => this.erroHandler.handler(error));
  }

  update() {
    this.produtoService
      .update(this.produtoSelect.id, this.formCad.value)
      .then((resp) => {
        this.postPersit('atualizado');
      })
      .catch((error) => this.erroHandler.handler(error));
  }

  delete(id: number) {
    this.produtoService
      .delete(id)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucessao',
          detail: 'Produto excluido com sucesso',
        });
        this.pesquisar();
      })
      .catch((error) => this.erroHandler.handler(error));
  }

  filtrarFabricantes(event: any) {
    this.filterFab.size = 100;
    this.filterFab.descricao = event.query;
    this.fabricanteService
      .findAll(this.filterFab)
      .then((resp) => {
        this.fabricantes = resp.conteudo;
      })
      .catch((error) => this.erroHandler.handler(error));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    this.rows = event.rows!;
    this.first = event.first!;
    console.log(this.first);
    const pagina = event.first! / event.rows!;
    this.pesquisar(pagina);
  }

  pesquisar(pagina = 0) {
    if (this.form.value.tipoFiltro === 1) {
      this.filtro.nomeFabricante = this.form.value.descricao;
    } else {
      this.filtro.modelo = this.form.value.descricao;
    }
    this.filtro.page = pagina;
    this.filtro.size = this.rows;
    this.produtoService
      .findAll(this.filtro)
      .then((resp) => {
        this.produtos = resp.conteudo;
        this.totalRegistros = resp.total;
      })
      .catch((error) => this.erroHandler.handler(error));
  }

  initForm() {
    this.form = new FormGroup({
      tipoFiltro: new FormControl(null),
      descricao: new FormControl(null, [Validators.required]),
    });

    this.formCad = new FormGroup({
      modelo: new FormControl(null, [
        Validators.required,
        Validators.maxLength(70),
      ]),
      descricao: new FormControl(null, [Validators.maxLength(255)]),
      valorUnitario: new FormControl(null, [Validators.required]),
      fabricante: new FormControl([Validators.required]),
    });
  }

  private postPersit(tipo: 'cadastrado' | 'atualizado') {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucessao',
      detail: `Produto ${tipo} com sucesso`,
    });
    this.showCreateDialog = false;
    this.pesquisar(this.first / this.rows);
    this.formCad.reset();
  }
}
