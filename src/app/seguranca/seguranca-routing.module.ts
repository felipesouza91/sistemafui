import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {LoginFormComponent} from './login-form/login-form.component';
import {NaoAutorizadoComponent} from './../core/nao-autorizado.component';
const routesSeguranca: Routes = [
  {path: 'login', component: LoginFormComponent},
  {path: 'nao-autorizado', component: NaoAutorizadoComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routesSeguranca)],
  exports: [RouterModule],
})
export class SegurancaRoutingModule {}
