import {FabricanteComponent} from './fabricante/fabricante.component';
import {ProdutoComponent} from './produto/produto.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {GrupoComponent} from './grupo/grupo.component';
import {CidadeComponent} from './cidade/cidade.component';
import {BairroComponent} from './bairro/bairro.component';
import {AuthGuard} from './../seguranca/auth.guard';
import {MotivoosComponent} from './motivoos/motivoos.component';

const auxRoutes: Routes = [
  {
    path: 'grupo',
    component: GrupoComponent,
    canActivate: [AuthGuard],
    data: {roles: ['6']},
  },
  {
    path: 'cidade',
    component: CidadeComponent,
    canActivate: [AuthGuard],
    data: {roles: ['9']},
  },
  {
    path: 'bairro',
    component: BairroComponent,
    canActivate: [AuthGuard],
    data: {roles: ['12']},
  },
  {
    path: 'motivo-os',
    component: MotivoosComponent,
    canActivate: [AuthGuard],
    data: {roles: ['18']},
  },
  {
    path: 'produto',
    component: ProdutoComponent,
    canActivate: [AuthGuard],
    data: {roles: ['42']},
  },
  {
    path: 'fabricante',
    component: FabricanteComponent,
    canActivate: [AuthGuard],
    data: {roles: ['39']},
  },
];

@NgModule({
  imports: [RouterModule.forChild(auxRoutes)],
  exports: [RouterModule],
})
export class AuxiliaresRoutingModule {}
