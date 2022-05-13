import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {AutoCompleteModule} from 'primeng/autocomplete';
import {MessageModule} from 'primeng/message';
import {ButtonModule} from 'primeng/button';
import {CalendarModule} from 'primeng/calendar';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {AccordionModule} from 'primeng/accordion';
import {TableModule} from 'primeng/table';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';

import {PesquisaAtendimentoComponent} from './pesquisa-atendimento/pesquisa-atendimento.component';
import {CadastroAtendimentoComponent} from './cadastro-atendimento/cadastro-atendimento.component';
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DialogModule,
    TableModule,
    AccordionModule,
    InputTextareaModule,
    CalendarModule,
    ButtonModule,
    MessageModule,
    AutoCompleteModule,
  ],
  declarations: [CadastroAtendimentoComponent, PesquisaAtendimentoComponent],
  exports: [CadastroAtendimentoComponent, PesquisaAtendimentoComponent],
})
export class AtendimentoModule {}
