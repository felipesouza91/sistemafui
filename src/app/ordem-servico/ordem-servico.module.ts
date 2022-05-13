import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { KeyFilterModule } from 'primeng/keyfilter';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageModule } from 'primeng/message';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';

import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

import { PesquisaOrdemServicoComponent } from './pesquisa-ordem-servico/pesquisa-ordem-servico.component';
import { CadastroOrdemServicoComponent } from './cadastro-ordem-servico/cadastro-ordem-servico.component';




@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    DialogModule,
    KeyFilterModule,
    InputTextModule,
    MessageModule,
    AutoCompleteModule,
    TableModule,
    TooltipModule,
    DropdownModule,
    CalendarModule,
    InputTextareaModule
  ],
  declarations: [
    PesquisaOrdemServicoComponent,
    CadastroOrdemServicoComponent,
  ],
  exports: [
    PesquisaOrdemServicoComponent,
    CadastroOrdemServicoComponent
  ]
})
export class OrdemServicoModule { }
