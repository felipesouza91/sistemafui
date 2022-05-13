import { SegurancaRoutingModule } from './seguranca/seguranca-routing.module';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PesquisaOrdemServicoComponent } from './ordem-servico/pesquisa-ordem-servico/pesquisa-ordem-servico.component';
import { PaginaNaoEncontradaComponent } from './core/pagina-nao-encontrada.component';

import { AuthGuard } from './seguranca/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'cliente', pathMatch: 'full' },

  {
    path: 'ordemservico',
    component: PesquisaOrdemServicoComponent,
    canActivate: [AuthGuard],
  },

  { path: 'pagina-nao-encontrada', component: PaginaNaoEncontradaComponent },

  { path: '**', redirectTo: 'pagina-nao-encontrada' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
