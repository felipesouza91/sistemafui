import { ConfirmationService } from 'primeng/api';
import { AuthService } from './../../seguranca/auth.service';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { Usuario } from '../../core/mode';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-pesquisa-usuario',
  templateUrl: './pesquisa-usuario.component.html',
  styleUrls: ['./pesquisa-usuario.component.css'],
})
export class PesquisaUsuarioComponent implements OnInit {
  form!: FormGroup;
  listUsuario: Usuario[] = [];
  rows = 5;
  filtros = [
    { label: 'Todos', value: 0 },
    { label: 'Nome Funcionario', value: 1 },
    { label: 'Apelido', value: 2 },
    { label: 'Grupo de acesso', value: 3 },
  ];

  constructor(
    public auth: AuthService,
    private erroService: ErrorHandlerService,
    private confirmationService: ConfirmationService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.criarFormulario();
  }

  ngAfterViewInit() {
    this.init();
  }

  pesquisar() {
    console.log(this.form.value);
  }

  init() {
    this.usuarioService
      .buscarResumo()
      .then((resp) => {
        this.listUsuario = resp!;
      })
      .catch((erro) => this.erroService.handler(erro));
  }

  criarFormulario() {
    this.form = new FormGroup({
      opcao: new FormControl(),
      descricao: new FormControl(),
    });
  }

  confirmaExclusao(codigo: number) {
    this.confirmationService.confirm({
      message: 'Deseja desabilitar o usuario selecionado?',
      accept: () => {},
    });
  }
}
