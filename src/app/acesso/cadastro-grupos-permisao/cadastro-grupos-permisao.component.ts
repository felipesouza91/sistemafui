import { PermissionService } from './../permission.service';

import { AuthService } from './../../seguranca/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { GrupoAcessoService } from '../grupo-acesso.service';
import { ErrorHandlerService } from '../../core/error-handler.service';

import { MessageService, TreeNode } from 'primeng/api';
import { AccessGroupInput } from './../../core/models-input';

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
    this.criarForm().then(() => {
      const id = this.route.snapshot.params['codigo'];
      if (id) {
        this.buscarGrupoAcesso(id);
      }
    });
  }

  criar() {
    if (this.form.value.id) {
      this.atualizar();
    } else {
      this.salvar();
    }
  }

  salvar() {
    const { ativo, descricao, permissions } = this.form
      .value as AccessGroupInput;
    const inputFormated = permissions.map(
      ({ nameId, read, write, remove }) => ({
        nameId,
        read,
        write,
        remove,
      })
    );

    this.grupoAcessoService
      .salvar({
        ativo,
        descricao,
        permissions: inputFormated,
      })
      .then((resp) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Grupo de acesso cadastrado com sucesso!',
        });
        this.form.reset();
        this.router.navigate([`grupoacesso`]);
      })
      .catch((error) => this.erroService.handler(error));
  }

  atualizar() {
    const { ativo, descricao, permissions } = this.form
      .value as AccessGroupInput;
    const inputFormated = permissions.map(
      ({ nameId, read, write, remove }) => ({
        nameId,
        read,
        write,
        remove,
      })
    );
    this.grupoAcessoService
      .atualizar(this.form.value.id, {
        ativo,
        descricao,
        permissions: inputFormated,
      })
      .then((response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Grupo de acessso atualizado com sucesso!',
        });
        this.form.reset();
        this.router.navigate([`grupoacesso`]);
      })
      .catch((error) => this.erroService.handler(error));
  }

  get permissions() {
    return this.form.get('permissions') as FormArray;
  }

  async criarForm() {
    this.form = new FormGroup({
      id: new FormControl(),
      ativo: new FormControl(false, Validators.required),
      descricao: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      permissions: new FormArray([]),
    });
    await this.permissionService.loadAvailablePermissions().then((response) =>
      response.map(({ nameId, formattedName, remove, read, write }) =>
        (this.form.get('permissions') as FormArray).push(
          new FormGroup({
            nameId: new FormControl(nameId),
            formattedName: new FormControl(formattedName),
            read: new FormControl(read),
            write: new FormControl(write),
            remove: new FormControl(remove),
          })
        )
      )
    );
  }

  buscarGrupoAcesso(codigo: number) {
    this.grupoAcessoService
      .buscarPorCodigo(codigo)
      .then((resp) => {
        const { ativo, descricao, id, permissions } = resp;
        this.form.patchValue({
          id,
          ativo,
          descricao,
          permissions: permissions.sort((item0, item1) =>
            item0.formattedName > item1.formattedName ? 1 : -1
          ),
        });
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
