import { KeyFilterModule } from 'primeng/keyfilter';

import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ToggleButtonModule} from 'primeng/togglebutton';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { SelectButtonModule } from 'primeng/selectbutton';

import { CadastroDvrComponent } from './cadastro-dvr/cadastro-dvr.component';
import { TabelaDvrComponent } from './tabela-dvr/tabela-dvr.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    SelectButtonModule,
    InputMaskModule,
    KeyFilterModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    DialogModule,
    ToggleButtonModule,
    TabViewModule,
    PanelModule,
    TooltipModule,
    InputTextModule,
    DropdownModule
  ],
  declarations: [
    CadastroDvrComponent,
    TabelaDvrComponent
  ],
  exports: [
    CadastroDvrComponent,
    TabelaDvrComponent
  ]
})
export class DvrModule { }
