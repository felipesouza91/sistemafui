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
import { Table } from 'primeng/table';
import { Fabricante } from './../../core/mode';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ProdutoComponent implements OnInit {
  filtros = [
    { label: 'Fabricante', value: 1 },
    { label: 'Modelo', value: 2 },
  ];
  produtos: Produto[] = [];
  fabricantes: Fabricante[] = [];
  @ViewChild('tab', { static: true }) tabela!: Table;
  totalRegistros!: number;
  filtro = new ProdutoFilter();
  form!: FormGroup;

  formCad!: FormGroup;
  filterFab = new FabricanteFilter();
  new = false;
  produtoSelect!: Produto;
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
    this.new = true;
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
    this.filtro.size = this.tabela.rows;
    this.produtoService
      .findAll(this.filtro)
      .then((resp) => {
        this.produtos = resp.conteudo;
        this.totalRegistros = resp.total;
        if (resp.firstPage && this.tabela.first > 1) {
          this.tabela.first = 0;
        }
        this.form.reset();
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

  private postPersit(tipo: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucessao',
      detail: `Produto ${tipo} com sucesso`,
    });
    this.new = false;
    this.pesquisar();
    this.formCad.reset();
  }
}
