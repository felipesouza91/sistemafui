import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {NaoAutorizadoComponent} from './../core/nao-autorizado.component';
import { AuthorizedComponent } from './authorized.component';
const routesSeguranca: Routes = [
  { path: 'authorized', component: AuthorizedComponent},
  {path: 'nao-autorizado', component: NaoAutorizadoComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routesSeguranca)],
  exports: [RouterModule],
})
export class SegurancaRoutingModule {}
