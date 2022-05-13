import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AuthGuard} from './../seguranca/auth.guard';
import {PesquisaGruposPermisaoComponent} from './pesquisa-grupos-permisao/pesquisa-grupos-permisao.component';
import {CadastroGruposPermisaoComponent} from './cadastro-grupos-permisao/cadastro-grupos-permisao.component';

import {PesquisaUsuarioComponent} from './pesquisa-usuario/pesquisa-usuario.component';
import {CadastroUsuarioComponent} from './cadastro-usuario/cadastro-usuario.component';

const acessoRoutes: Routes = [
  {
    path: 'grupoacesso',
    component: PesquisaGruposPermisaoComponent,
    canActivate: [AuthGuard],
    data: {roles: ['33']},
  },
  {
    path: 'grupoacesso/novo',
    component: CadastroGruposPermisaoComponent,
    canActivate: [AuthGuard],
    data: {roles: ['31']},
  },
  {
    path: 'grupoacesso/:codigo',
    component: CadastroGruposPermisaoComponent,
    canActivate: [AuthGuard],
    data: {roles: ['31', '33']},
  },

  {
    path: 'usuario',
    component: PesquisaUsuarioComponent,
    canActivate: [AuthGuard],
    data: {roles: ['30']},
  },
  {
    path: 'usuario/novo',
    component: CadastroUsuarioComponent,
    canActivate: [AuthGuard],
    data: {roles: ['28']},
  },
  {
    path: 'usuario/:codigo',
    component: CadastroUsuarioComponent,
    canActivate: [AuthGuard],
    data: {roles: ['28', '30']},
  },
];

@NgModule({
  imports: [RouterModule.forChild(acessoRoutes)],
  exports: [RouterModule],
})
export class AcessoRoutingModule {}
