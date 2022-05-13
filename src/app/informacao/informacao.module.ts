import {CalendarModule} from 'primeng/calendar';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {TableModule} from 'primeng/table';

import {ListaInformacaoComponent} from './lista-informacao/lista-informacao.component';
import {CadastroInformacaoComponent} from './cadastro-informacao/cadastro-informacao.component';
@NgModule({
  declarations: [ListaInformacaoComponent, CadastroInformacaoComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    ButtonModule,
    CalendarModule,
    InputTextModule,
    InputTextareaModule,
  ],
  exports: [ListaInformacaoComponent, CadastroInformacaoComponent],
})
export class InformacaoModule {}
