import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KeyFilterModule } from 'primeng/keyfilter';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { MessageModule } from 'primeng/message';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ReactiveFormsModule } from '@angular/forms';

import { InformacaoModule } from './../informacao/informacao.module';
import { AtendimentoModule } from './../atendimento/atendimento.module';
import { VerificacaoModule } from '../verificacao/verificacao.module';
import { CadastroClienteComponent } from './cadastro-cliente/cadastro-cliente.component';
import { PainelClienteComponent } from './painel-cliente/painel-cliente.component';
import { PesquisaClienteComponent } from './pesquisa-cliente/pesquisa-cliente.component';
import { OrdemServicoModule } from '../ordem-servico/ordem-servico.module';
import { DvrModule } from '../dvr/dvr.module';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ClienteRoutingModule } from './cliente-routing.module';
import { AppSharedModule } from './../shared/app-shared.module';
import { CardModule } from 'primeng/card';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ClienteRoutingModule,
    KeyFilterModule,
    OrdemServicoModule,
    DvrModule,
    VerificacaoModule,
    AtendimentoModule,
    InformacaoModule,
    AutoCompleteModule,
    KeyFilterModule,
    InputTextModule,
    CardModule,
    ButtonModule,
    TooltipModule,
    TableModule,
    DropdownModule,
    MessageModule,
    AppSharedModule,
    TableModule,
    InputMaskModule,
    SelectButtonModule,
    TabViewModule,
  ],
  declarations: [
    CadastroClienteComponent,
    PainelClienteComponent,
    PesquisaClienteComponent,
  ],
  exports: [
    CadastroClienteComponent,
    PainelClienteComponent,
    PesquisaClienteComponent,
  ],
})
export class ClienteModule {}
