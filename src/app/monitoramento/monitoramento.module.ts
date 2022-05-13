import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TableModule} from 'primeng/table';

import {DashboardComponent} from './dashboard/dashboard.component';
import {MonitoramentoRoutingModule} from './monitoramento-routing.module';

@NgModule({
  imports: [CommonModule, TableModule, MonitoramentoRoutingModule],
  declarations: [DashboardComponent],
})
export class MonitoramentoModule {}
