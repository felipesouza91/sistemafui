import { AuthService } from './../../seguranca/auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { GrupoAcessoService } from '../grupo-acesso.service';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-pesquisa-grupos-permisao',
  templateUrl: './pesquisa-grupos-permisao.component.html',
  styleUrls: ['./pesquisa-grupos-permisao.component.css'],
})
export class PesquisaGruposPermisaoComponent implements OnInit {
  form!: FormGroup;
  listGrupos: any;
  constructor(
    public auth: AuthService,
    private erroService: ErrorHandlerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private grupoAcessoService: GrupoAcessoService
  ) {}

  ngOnInit() {
    this.configFormulsario();
    this.pesquisar();
  }

  pesquisar() {
    this.grupoAcessoService
      .listaGrupoAcessoResumo()
      .then((resp) => {
        this.listGrupos = resp;
      })
      .catch((erro) => this.erroService.handler(erro));
  }

  confirmaExclusao(codigo: number) {
    this.confirmationService.confirm({
      message: 'Deseja excluir o Grupo de acesso selecionado?',
      accept: () => {
        this.excluir(codigo);
      },
    });
  }

  excluir(codigo: number) {
    this.grupoAcessoService
      .excluir(codigo)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Grupo de acesso removido com sucesso!',
        });
        this.pesquisar();
      })
      .catch((error) => this.erroService.handler(error));
  }

  configFormulsario() {
    this.form = new FormGroup({
      nome: new FormControl(null),
    });
  }
}
