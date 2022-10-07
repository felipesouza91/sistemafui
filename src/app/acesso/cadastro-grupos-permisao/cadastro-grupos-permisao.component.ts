import { PermissionService } from './../permission.service';
import { GrupoAcesso, Permissao } from './../../core/mode';
import { AuthService } from './../../seguranca/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { GrupoAcessoService } from '../grupo-acesso.service';
import { ErrorHandlerService } from '../../core/error-handler.service';

import { MessageService, TreeNode } from 'primeng/api';
import { tipoAcesso } from 'src/app/core/navbar/constants';
import { IdInput, IAccessGroupInput } from './../../core/models-input';

@Component({
  selector: 'app-cadastro-grupos-permisao',
  templateUrl: './cadastro-grupos-permisao.component.html',
  styleUrls: ['./cadastro-grupos-permisao.component.css'],
})
export class CadastroGruposPermisaoComponent implements OnInit {
  form!: FormGroup;
  listPermisao = new Array();
  teste = [];
  grupoAcesso: any;

  checked: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    private router: Router,
    private erroService: ErrorHandlerService,
    private messageService: MessageService,
    private grupoAcessoService: GrupoAcessoService,
    private permissionService: PermissionService
  ) {}

  ngOnInit() {
    this.listPermisao = [];
    this.criarForm();
    const id = this.route.snapshot.params['codigo'];
    if (id) {
      this.buscarGrupoAcesso(id);
    }
  }

  criar() {
    if (this.form.value.id) {
      this.atualizar();
    } else {
      this.salvar();
    }
  }

  salvar() {
    console.log(this.form.value);
    /*
    this.grupoAcessoService
      .salvar(this.createGrupoAcesso())
      .then((resp) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Grupo de acesso cadastrado com sucesso!',
        });
        this.form.reset();
        this.router.navigate([`grupoacesso`]);
      })
      .catch((error) => this.erroService.handler(error));*/
  }

  atualizar() {

  }

  get permissions() {
    return this.form.get('permissions') as FormArray;
  }

  criarForm() {
    this.form = new FormGroup({
      id: new FormControl(),
      ativo: new FormControl(false, Validators.required),
      descricao: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      permissions: new FormArray([]),
    });
    this.permissionService.loadAvailablePermissions()
    .then(response => response.map(({nameId, formattedName,remove,read,write}) =>
        (this.form.get('permissions') as FormArray).push(
          new FormGroup({
            nameId: new FormControl(nameId),
            formattedName: new FormControl(formattedName),
            read: new FormControl(read),
            write: new FormControl(write),
            delete: new FormControl(remove),
          })
        )
      )
    );

  }

  buscarGrupoAcesso(codigo: number) {
    this.grupoAcessoService
      .buscarPorCodigo(codigo)
      .then((resp) => {
        resp.permissoes = this.grupoAcessoService.converterPermisao(
          resp.permissoes
        );

        this.form.patchValue(resp);
      })
      .catch((error) => this.erroService.handler(error));
  }
  clearForm() {
    this.form.reset();
  }

  isValid() {
    return this.form.valid;
  }
}
