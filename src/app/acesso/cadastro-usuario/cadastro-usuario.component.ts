import { AuthService } from './../../seguranca/auth.service';
import { GrupoAcessoService } from '../grupo-acesso.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { UsuarioService } from '../usuario.service';
import { Usuario } from '../../core/mode';
import { MessageService } from 'primeng/api';
import { IUserInput } from '../../core/models-input';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.css'],
})
export class CadastroUsuarioComponent implements OnInit {
  formUsuario: FormGroup;
  usuario: Usuario;
  grupos = [];

  status = [
    { value: true, label: 'Ativo' },
    { value: false, label: 'Desativado' },
  ];

  constructor(
    private erroService: ErrorHandlerService,
    public auth: AuthService,
    private router: Router,
    private messageService: MessageService,
    private grupoAcessoService: GrupoAcessoService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.init();
    this.criarFormulario();
  }

  criar() {
    if (this.usuario) {
      this.atualizar();
    } else {
      this.salvar();
    }
    this.router.navigate(['usuario']);
  }

  atualizar() {}

  salvar() {
    this.usuarioService
      .salvar(this.formUsuario.value as IUserInput)
      .then((resp) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuario cadastrado com sucesso',
        });
        this.formUsuario.reset();
      })
      .catch((error) => this.erroService.handler(error));
  }

  init() {
    this.grupoAcessoService
      .listaGrupoAcessoResumo()
      .then((resp) => {
        resp.map((r) => {
          this.grupos.push({ label: r.descricao, value: r });
        });
      })
      .catch((error) => this.erroService.handler(error));
  }

  criarFormulario() {
    this.formUsuario = new FormGroup({
      ativo: new FormControl(null, Validators.required),
      nome: new FormControl(null, Validators.required),
      apelido: new FormControl(null, Validators.required),
      senha: new FormControl(null, Validators.required),
      grupoAcesso: new FormControl(null, Validators.required),
    });
  }
}
