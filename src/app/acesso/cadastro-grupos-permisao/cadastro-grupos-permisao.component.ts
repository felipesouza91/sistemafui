import { GrupoAcesso, Permissao } from './../../core/mode';
import { AuthService } from './../../seguranca/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { GrupoAcessoService } from '../grupo-acesso.service';
import { ErrorHandlerService } from '../../core/error-handler.service';

import { MessageService, TreeNode } from 'primeng/api';
import { tipoAcesso } from 'src/app/core/navbar/constants';

@Component({
  selector: 'app-cadastro-grupos-permisao',
  templateUrl: './cadastro-grupos-permisao.component.html',
  styleUrls: ['./cadastro-grupos-permisao.component.css'],
})
export class CadastroGruposPermisaoComponent implements OnInit {
  form: FormGroup;
  listPermisao = new Array();
  teste = [];
  grupoAcesso: any;
  filesTree: TreeNode[] = new Array();
  selectPermissoes: TreeNode[] = [];

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    private router: Router,
    private erroService: ErrorHandlerService,
    private messageService: MessageService,
    private grupoAcessoService: GrupoAcessoService
  ) {}

  ngOnInit() {
    this.listPermisao = null;
    this.criarForm();
    this.startListPermisao();
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
    this.router.navigate([`grupoacesso`]);
  }

  salvar() {
    this.grupoAcessoService
      .salvar(this.createGrupoAcesso())
      .then((resp) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Grupo de acesso cadastrado com sucesso!',
        });
        this.form.reset();
      })
      .catch((error) => this.erroService.handler(error));
  }

  atualizar() {
    const accessGroup = this.createGrupoAcesso();
    this.grupoAcessoService
      .atualizar(accessGroup.id, accessGroup)
      .then((resp) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Grupo de acesso atualizado com sucesso!',
        });
        this.form.reset();
      })
      .catch((error) => this.erroService.handler(error));
  }

  createGrupoAcesso(): GrupoAcesso {
    const grupoPermisao: GrupoAcesso = new GrupoAcesso();
    grupoPermisao.id = this.form.value.id;
    grupoPermisao.descricao = this.form.value.descricao;
    grupoPermisao.ativo = this.form.value.ativo;
    this.selectPermissoes.map((a) => {
      if (a.data) {
        const s = new Permissao();
        s.id = a.data;
        grupoPermisao.permissoes.push(s);
      }
    });
    return grupoPermisao;
  }

  criarForm() {
    this.form = new FormGroup({
      id: new FormControl(),
      ativo: new FormControl(false, Validators.required),
      descricao: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }

  buscarGrupoAcesso(codigo: number) {
    this.grupoAcessoService
      .buscarPorCodigo(codigo)
      .then((resp) => {
        resp.permissoes = this.grupoAcessoService.converterPermisao(
          resp.permissoes
        );
        this.selectPermissoes = this.converterPermissoesToTreeNode(
          resp.permissoes
        );
        this.form.patchValue(resp);
      })
      .catch((error) => this.erroService.handler(error));
  }

  startListPermisao() {
    this.grupoAcessoService.itensPermisao().then((resp) => {
      this.listPermisao = resp;
      this.populateTree();
    });
  }

  populateTree() {
    tipoAcesso.map((tipo) => {
      this.filesTree.push({
        label: tipo,
        expandedIcon: 'fa fa-folder-open',
        collapsedIcon: 'fa fa-folder',
        children: this.createChildenTree(tipo),
      });
    });
  }

  converterPermissoesToTreeNode(list: any): TreeNode[] {
    const treeNod = new Array<TreeNode>();
    tipoAcesso.map((tipo) => {
      list.map((permisao) => {
        if (permisao.descricao.includes(tipo)) {
          treeNod.push({
            label:
              permisao.descricao.substr(
                0,
                permisao.descricao.indexOf(' ') - 1
              ) + 'r',
            data: permisao.id,
            key: permisao.id,
            leaf: true,
            parent: this.filesTree.find((tree) => {
              if (tree.label.includes(tipo)) {
                tree.partialSelected = true;
                tree.expanded = true;
                return true;
              }
              return false;
            }),
          });
        }
      });
    });
    return treeNod;
  }

  createChildenTree(filter: string): TreeNode[] {
    const treeNod = new Array<TreeNode>();
    this.listPermisao.forEach((value) => {
      if (filter.toUpperCase() === value.tipo) {
        treeNod.push({
          label: value.descricao,
          data: value.id,
          key: value.id,
        });
      }
    });
    return treeNod;
  }

  clearForm() {
    this.form.reset();
  }

  isValid() {
    return this.selectPermissoes.length > 0 && this.form.valid;
  }
}
