import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TreeModule } from 'primeng/tree';
import { PasswordModule } from 'primeng/password';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TooltipModule } from 'primeng/tooltip';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';

import { CadastroUsuarioComponent } from './cadastro-usuario/cadastro-usuario.component';
import { PesquisaGruposPermisaoComponent } from './pesquisa-grupos-permisao/pesquisa-grupos-permisao.component';
import { CadastroGruposPermisaoComponent } from './cadastro-grupos-permisao/cadastro-grupos-permisao.component';
import { PesquisaUsuarioComponent } from './pesquisa-usuario/pesquisa-usuario.component';
import { AcessoRoutingModule } from './acesso-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AcessoRoutingModule,
    DropdownModule,
    TreeModule,
    TableModule,
    PasswordModule,
    ToggleButtonModule,
    TooltipModule,
    MessageModule,
    ButtonModule,
    InputTextModule,
    AutoCompleteModule,
  ],
  declarations: [
    CadastroGruposPermisaoComponent,
    CadastroUsuarioComponent,
    PesquisaGruposPermisaoComponent,
    PesquisaUsuarioComponent,
  ],
  exports: [
    CadastroGruposPermisaoComponent,
    CadastroUsuarioComponent,
    PesquisaGruposPermisaoComponent,
  ],
})
export class AcessoModule {}
