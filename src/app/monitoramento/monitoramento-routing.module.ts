import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {DashboardComponent} from './dashboard/dashboard.component';

const moniRoutes: Routes = [{path: 'monitoramento', component: DashboardComponent}];

@NgModule({
  imports: [RouterModule.forChild(moniRoutes)],
  exports: [RouterModule],
})
export class MonitoramentoRoutingModule {}
