import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  CommonModule,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CalendarModule } from 'primeng/calendar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ButtonModule } from 'primeng/button';

import { AppComponent } from './app.component';

import { MonitoramentoModule } from './monitoramento/monitoramento.module';
import { CoreModule } from './core/core.module';
import { AtendimentoModule } from './atendimento/atendimento.module';
import { AcessoModule } from './acesso/acesso.module';
import { DvrModule } from './dvr/dvr.module';
import { ClienteModule } from './cliente/cliente.module';
import { AuxiliaresModule } from './auxiliares/auxiliares.module';
import { OrdemServicoModule } from './ordem-servico/ordem-servico.module';
import { SegurancaModule } from './seguranca/seguranca.module';
import { AppSharedModule } from './shared/app-shared.module';
import { AppRoutingModule } from './app-routing.module';
import { ProfileModule } from './profile/profile.module';
import { CardModule } from 'primeng/card';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    CalendarModule,

    BrowserAnimationsModule,
    CardModule,
    ButtonModule,

    SplitButtonModule,

    CoreModule,

    AcessoModule,
    AtendimentoModule,
    AuxiliaresModule,
    ClienteModule,
    DvrModule,
    OrdemServicoModule,
    SegurancaModule,
    AppSharedModule,
    MonitoramentoModule,
    ProfileModule,
    AppRoutingModule,
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy, // PathLocationStrategy
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
