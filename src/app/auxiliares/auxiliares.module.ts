import { InputTextareaModule } from 'primeng/inputtextarea';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { BairroComponent } from './bairro/bairro.component';
import { CidadeComponent } from './cidade/cidade.component';
import { GrupoComponent } from './grupo/grupo.component';

import { DialogModule } from 'primeng/dialog';
import { BlockUIModule } from 'primeng/blockui';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';

import { MotivoosComponent } from './motivoos/motivoos.component';
import { AuxiliaresRoutingModule } from './auxiliares-routing.module';
import { FabricanteComponent } from './fabricante/fabricante.component';
import { ProdutoComponent } from './produto/produto.component';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { AppSharedModule } from '../shared/app-shared.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    AppSharedModule,
    ButtonModule,
    AutoCompleteModule,
    BlockUIModule,
    InputTextareaModule,
    DialogModule,
    InputNumberModule,
    TooltipModule,
    AuxiliaresRoutingModule,
    DropdownModule,
    MessageModule,
    TableModule,
  ],
  declarations: [
    BairroComponent,
    CidadeComponent,
    GrupoComponent,
    MotivoosComponent,
    FabricanteComponent,
    ProdutoComponent,
  ],
  exports: [
    BairroComponent,
    CidadeComponent,
    GrupoComponent,
    MotivoosComponent,
  ],
})
export class AuxiliaresModule {}
