import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MessageModule } from 'primeng/message';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { DvrModule } from '../dvr/dvr.module';
import { OrdemServicoModule } from '../ordem-servico/ordem-servico.module';
import { VerificacaoModule } from '../verificacao/verificacao.module';
import { AtendimentoModule } from './../atendimento/atendimento.module';
import { InformacaoModule } from './../informacao/informacao.module';
import { AppSharedModule } from './../shared/app-shared.module';
import { CadastroClienteComponent } from './cadastro-cliente/cadastro-cliente.component';
import { ClienteRoutingModule } from './cliente-routing.module';
import { FileListComponent } from './file-list/file-list.component';
import { PainelClienteComponent } from './painel-cliente/painel-cliente.component';
import { PesquisaClienteComponent } from './pesquisa-cliente/pesquisa-cliente.component';
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
    FileUploadModule,
    KeyFilterModule,
    InputTextModule,
    DialogModule,
    CardModule,
    ButtonModule,
    TooltipModule,
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
    FileListComponent,
  ],
  exports: [
    CadastroClienteComponent,
    PainelClienteComponent,
    PesquisaClienteComponent,
  ],
})
export class ClienteModule {}
