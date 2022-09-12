import { AuthService } from './../../seguranca/auth.service';
import { ConfirmationService } from 'primeng/api';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { CidadeService, FiltroCidade } from '../cidade.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Cidade } from 'src/app/core/mode';

@Component({
  selector: 'app-cidade',
  templateUrl: './cidade.component.html',
  styleUrls: ['./cidade.component.css'],
})
export class CidadeComponent implements OnInit {
  filtro: FiltroCidade = {} as FiltroCidade;
  totalRegistros = 0;
  opt = false;
  form!: FormGroup;
  cidades: Cidade[] = [];
  rows = 5;
  first = 0;
  constructor(
    private confirmatioService: ConfirmationService,
    public auth: AuthService,
    private messageService: MessageService,
    private erroHandler: ErrorHandlerService,
    private cidadeService: CidadeService
  ) {}

  ngOnInit() {
    this.configFormulario(this.opt);
  }

  criar() {
    if (this.form.value.id) {
      this.editar();
    } else {
      this.salvar();
    }
  }

  salvar() {
    this.cidadeService
      .salvar(this.form.value)
      .then((reponse) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Cidade cadastrada com sucesso!',
        });
        this.configFormulario(false);
        this.pesquisar();
      })
      .catch((erro) => this.erroHandler.handler(erro));
  }

  editar() {
    this.cidadeService
      .autualizar(this.form.value.id, this.form.value)
      .then((reponse) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Cidade atualizada com sucesso!',
        });
        this.configFormulario(false);
        this.pesquisar();
      })
      .catch((erro) => this.erroHandler.handler(erro));
  }

  pesquisar(pagina = 0) {
    this.filtro.nome = this.form.value.nome;
    this.filtro.page = pagina;
    this.filtro.size = this.rows;
    this.cidadeService
      .pesquisar(this.filtro)
      .then((response) => {
        this.totalRegistros = response.total;
        this.cidades = response.conteudo;
      })
      .catch((erro) => this.erroHandler.handler(erro));
  }

  remover(cidade: any) {
    this.confirmatioService.confirm({
      message: `Deseja excluid a cidade: ${cidade.nome} ?`,
      accept: () => {
        this.excluir(cidade);
      },
    });
  }

  excluir(cidade: any) {
    this.cidadeService
      .excluir(cidade.id)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucessao',
          detail: 'Cidade excluida com sucesso',
        });
        this.configFormulario(false)
        this.pesquisar(Math.floor(this.totalRegistros / this.rows));
      })
      .catch((erro) => this.erroHandler.handler(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    this.rows = event.rows!;
    const pagina = event.first! / event.rows!;

    this.pesquisar(pagina);
  }

  configFormulario(tipo: boolean) {
    if (tipo) {
      this.form = new FormGroup({
        id: new FormControl(),
        nome: new FormControl(null, [
          Validators.required,
          Validators.minLength(4),
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

  editarAjust(cidade: any, opt: boolean) {
    this.form.setValue(cidade);
    this.opt = opt;
  }
}
