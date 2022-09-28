import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {NaoAutorizadoComponent} from './../core/nao-autorizado.component';
const routesSeguranca: Routes = [

  {path: 'nao-autorizado', component: NaoAutorizadoComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routesSeguranca)],
  exports: [RouterModule],
})
export class SegurancaRoutingModule {}
