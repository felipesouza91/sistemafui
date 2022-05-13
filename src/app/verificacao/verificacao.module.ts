import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { InputMaskModule } from 'primeng/inputmask';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

import { PesquisaVerificacaoComponent } from './pesquisa-verificacao/pesquisa-verificacao.component';
import { CadastroVerificacaoComponent } from './cadastro-verificacao/cadastro-verificacao.component';



@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputMaskModule,
    InputTextModule,
    ToggleButtonModule,
    DropdownModule,
    CalendarModule,
    DialogModule,
    ButtonModule,
    TableModule
  ],
  declarations: [
    PesquisaVerificacaoComponent,
    CadastroVerificacaoComponent
  ],
  exports: [
    PesquisaVerificacaoComponent
  ]
})
export class VerificacaoModule { }
