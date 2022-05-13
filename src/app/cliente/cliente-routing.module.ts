import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './../seguranca/auth.guard';
import { PesquisaClienteComponent } from './pesquisa-cliente/pesquisa-cliente.component';
import { PainelClienteComponent } from './painel-cliente/painel-cliente.component';

const clienteRoutes: Routes = [
  {
    path: 'cliente',
    component: PesquisaClienteComponent,
    canActivate: [AuthGuard],
    data: { roles: ['2'] },
  },
  {
    path: 'cliente/novo',
    component: PainelClienteComponent,
    canActivate: [AuthGuard],
    data: { roles: ['1'] },
  },
  {
    path: 'cliente/:codigo',
    component: PainelClienteComponent,
    canActivate: [AuthGuard],
    data: { roles: ['1', '2'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(clienteRoutes)],
  exports: [RouterModule],
})
export class ClienteRoutingModule {}
