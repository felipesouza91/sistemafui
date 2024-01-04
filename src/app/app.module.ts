import {
  CommonModule,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { SplitButtonModule } from 'primeng/splitbutton';

import { AppComponent } from './app.component';

import { CardModule } from 'primeng/card';
import { AcessoModule } from './acesso/acesso.module';
import { AppRoutingModule } from './app-routing.module';
import { AtendimentoModule } from './atendimento/atendimento.module';
import { AuxiliaresModule } from './auxiliares/auxiliares.module';
import { ClienteModule } from './cliente/cliente.module';
import { CoreModule } from './core/core.module';
import { DvrModule } from './dvr/dvr.module';
import { MonitoramentoModule } from './monitoramento/monitoramento.module';
import { OrdemServicoModule } from './ordem-servico/ordem-servico.module';
import { ProfileModule } from './profile/profile.module';
import { SegurancaModule } from './seguranca/seguranca.module';
import { AppSharedModule } from './shared/app-shared.module';

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
