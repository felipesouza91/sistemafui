import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Cidade, Grupo } from 'src/app/core/mode';
import { IClientInput } from 'src/app/core/models-input';
import { BairroService, FiltroBairro } from '../../auxiliares/bairro.service';
import { CidadeService, FiltroCidade } from '../../auxiliares/cidade.service';
import { GrupoService } from '../../auxiliares/grupo.service';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { ClienteService } from '../cliente.service';
import { Bairro } from './../../core/mode';
import { AuthService } from './../../seguranca/auth.service';

interface IValueDropdown<T> {
  label: string;
  value: T;
}

interface IEventQuery {
  query: string;
}

@Component({
  selector: 'app-cadastro-cliente',
  templateUrl: './cadastro-cliente.component.html',
  styleUrls: ['./cadastro-cliente.component.css'],
})
export class CadastroClienteComponent implements OnInit, AfterViewInit {
  @Input() cliente: any;
  @ViewChild('bairro', { static: true }) bairroCampo!: ViewChild;
  formCliente!: FormGroup;
  filtroBairro: FiltroBairro = {} as FiltroBairro;
  status = [
    { label: 'Ativo', value: true },
    { label: 'Cancelado', value: false },
  ];
  cidadeSelecionada!: Cidade;
  grupos: IValueDropdown<Grupo>[] = [];

  cidades: Cidade[] = [];

  bairros: Bairro[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    public auth: AuthService,
    private router: Router,
    private messageService: MessageService,
    private erroHandler: ErrorHandlerService,
    private grupoService: GrupoService,
    private cidadeService: CidadeService,
    private bairroService: BairroService,
    private clienteService: ClienteService
  ) {}

  ngOnInit() {
    this.initValues();
    this.criarFormulario();
    if (this.cliente) {
      this.cidadeSelecionada = this.cliente.endereco.bairro.cidade;
      this.formCliente.patchValue(this.cliente);
      this.formCliente.addControl(
        'cidade',
        new FormControl(this.cidadeSelecionada)
      );
    } else {
      this.formCliente.addControl(
        'cidade',
        new FormControl(this.cidadeSelecionada)
      );
    }
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  criar() {
    if (this.cliente) {
      this.update();
    } else {
      this.salvar();
    }
  }

  salvar() {
    this.formCliente.removeControl('cidade');
    this.clienteService
      .salvar(this.formCliente.value as IClientInput)
      .then((resp) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Cliente cadastrado com sucesso!',
        });
        this.formCliente.patchValue(resp);
        this.router.navigate([`cliente/${resp.id}`]);
      })
      .catch((error) => {
        this.erroHandler.handler(error);
        this.formCliente.addControl(
          'cidade',
          new FormControl(this.cidadeSelecionada)
        );
      });
  }

  update() {
    this.formCliente.removeControl('cidade');
    this.clienteService
      .update(this.cliente.id, this.formCliente.value as IClientInput)
      .then((resp) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Cliente cadastrado com sucesso!',
        });
        this.formCliente.patchValue(resp);
        this.router.navigate([`cliente/${resp.id}`]);
      })
      .catch((error) => {
        this.erroHandler.handler(error);
        this.formCliente.addControl(
          'cidade',
          new FormControl(this.cidadeSelecionada)
        );
      });
  }

  listaBairro(cidade: any) {
    this.formCliente
      .get('endereco')!
      .get('bairro')!
      .reset({ value: null, disabled: false });
    this.cidadeSelecionada = cidade;
  }

  initValues() {
    this.grupoService
      .listarTodos()
      .then((result) => {
        this.grupos = result.map((g) => ({ label: g.nome, value: g }));
      })
      .catch((error) => this.erroHandler.handler(error));
  }

  filtroBairroComplete(event: IEventQuery) {
    const filtro: FiltroBairro = {} as FiltroBairro;
    if (this.cliente) {
      filtro.nome = '';
    } else {
      filtro.nome = event.query;
    }
    filtro.cidade = this.cidadeSelecionada;
    filtro.size = 4000;
    this.bairroService
      .pesquisar(filtro)
      .then((resp) => {
        this.bairros = resp.conteudo;
      })
      .catch((error) => this.erroHandler.handler(error));
  }

  filtroCidade(event: IEventQuery) {
    const filtro: FiltroCidade = {} as FiltroCidade;
    filtro.nome = event.query;
    filtro.size = 200;
    this.cidadeService
      .pesquisar(filtro)
      .then((resp) => {
        this.cidades = resp.conteudo;
      })
      .catch((error) => this.erroHandler.handler(error));
  }

  criarFormulario() {
    this.formCliente = new FormGroup({
      id: new FormControl(null),
      codigoService: new FormControl(null),
      codigoParticao: new FormControl(null, [
        Validators.required,
        Validators.maxLength(4),
      ]),
      ativo: new FormControl(null, Validators.required),
      razaoSocial: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(255),
      ]),
      fantazia: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(255),
      ]),
      telefone1: new FormControl(null, Validators.maxLength(12)),
      telefone2: new FormControl(null, Validators.maxLength(12)),
      dominio: new FormControl(null, [
        Validators.minLength(8),
        Validators.maxLength(255),
      ]),
      grupo: new FormControl(null, Validators.required),
      endereco: new FormGroup({
        rua: new FormControl(null, [
          Validators.required,
          Validators.maxLength(255),
        ]),
        numero: new FormControl(null, Validators.required),
        complemento: new FormControl(null),
        referencia: new FormControl(null),
        bairro: new FormControl({ disabled: true }),
      }),
    });
  }
}
