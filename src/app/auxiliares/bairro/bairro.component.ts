import { AuthService } from './../../seguranca/auth.service';
import { LazyLoadEvent } from 'primeng/api';
import { CidadeService } from '../cidade.service';
import { BairroService, FiltroBairro } from '../bairro.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChildren, ViewChild } from '@angular/core';
import { INeighborhoodInput } from 'src/app/core/models-input';
import { Table } from 'primeng/table';
import { Bairro, Cidade } from 'src/app/core/mode';

interface ICityDropdown {
  label: string;
  value: { id: number; nome: string };
}

interface QueryEvent {
  query: string;
}

@Component({
  selector: 'app-bairro',
  templateUrl: './bairro.component.html',
  styleUrls: ['./bairro.component.css'],
})
export class BairroComponent implements OnInit {
  @ViewChild('tbl', { static: true }) tabela!: Table;
  opt = false;
  filtro: FiltroBairro = {} as FiltroBairro;
  form!: FormGroup;
  totalElementos = 0;
  cidades: ICityDropdown[] = [];
  bairros: Bairro[] = [];

  constructor(
    public auth: AuthService,
    private erroHandler: ErrorHandlerService,
    private confirmatioService: ConfirmationService,
    private messageService: MessageService,
    private bairroService: BairroService,
    private cidadeService: CidadeService
  ) {}

  ngOnInit() {
    this.initCidade();
    this.configFormulario(this.opt);
    this.pesquisar(0);
  }

  criar() {
    if (this.form.value.id) {
      this.editar();
    } else {
      this.salvar();
    }
  }

  salvar() {
    this.bairroService
      .salvar(this.form.value)
      .then((resp) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Bairro cadastrado com sucesso!',
        });
        this.configFormulario(false);
        this.pesquisar();
      })
      .catch((erro) => this.erroHandler.handler(erro));
  }

  editar() {
    const id = this.form.value.id;
    const neighborhood: INeighborhoodInput = this.form.value;
    this.bairroService
      .editar(id, neighborhood)
      .then((resp) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Bairro atualizado com sucesso!',
        });
        this.configFormulario(false);
        this.pesquisar();
      })
      .catch((erro) => this.erroHandler.handler(erro));
  }

  confirmaExclusao(bairro: any) {
    this.confirmatioService.confirm({
      message: `Tem certeza que deseja excluir o bairro: ${bairro.nome} ?`,
      accept: () => {
        this.excluir(bairro);
      },
    });
  }

  excluir(bairro: any) {
    this.bairroService
      .excluir(bairro.id)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Bairro excluido com sucesso!`,
        });
        this.pesquisar();
        this.tabela.first = 0;
      })
      .catch((error) => this.erroHandler.handler(error));
  }

  pesquisar(pagina = 0) {
    this.filtro.nome = this.form.value.nome;
    this.filtro.cidade = this.form.value.cidade;
    this.filtro.page = pagina;

    this.bairroService
      .pesquisar(this.filtro)
      .then((result) => {
        this.totalElementos = result.total;
        this.bairros = result.conteudo;
        if (result.firstPage && this.tabela.first > 1) {
          this.tabela.first = 0;
        }
        this.form.reset();
      })
      .catch((error) => this.erroHandler.handler(error));
  }

  formParaEdicao(bairro: any, tipo: boolean) {
    this.form.setValue(bairro);
    this.opt = tipo;
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first! / event.rows!;
    this.pesquisar(pagina);
  }

  resetForm(tipo: boolean) {
    this.form.reset();
    this.configFormulario(tipo);
  }

  initCidade() {
    this.cidadeService
      .listarTodos()
      .then((result) => {
        this.cidades = result.map((c) => ({
          label: c.nome,
          value: { id: c.id, nome: c.nome },
        }));
      })
      .catch((error) => this.erroHandler.handler(error));
  }

  handleOnComplet(event: QueryEvent) {
    this.cidadeService
      .pesquisar({
        nome: event.query,
        page: 0,
        size: 10,
      })
      .then((result) => {
        this.cidades = result.conteudo.map((c) => ({
          label: c.nome,
          value: {
            id: c.id,
            nome: c.nome,
          },
        }));
      })
      .catch((error) => this.erroHandler.handler(error));
  }

  configFormulario(tipo: boolean) {
    if (tipo) {
      this.form = new FormGroup({
        nome: new FormControl(null, [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(70),
        ]),
        cidade: new FormControl(null, Validators.required),
      });
    } else {
      this.form = new FormGroup({
        id: new FormControl(null),
        nome: new FormControl(null),
        cidade: new FormControl(null),
      });
    }
    this.opt = tipo;
  }
}
