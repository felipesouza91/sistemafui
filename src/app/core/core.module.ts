import { FabricanteService } from './../auxiliares/fabricante.service';
import { ProdutoService } from './../auxiliares/produto.service';
import { InformacaoService } from './../informacao/informacao.service';
import { HttpClientModule } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

import { AtendimentoService } from './../atendimento/atendimento.service';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SplitButtonModule } from 'primeng/splitbutton';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SidebarModule } from 'primeng/sidebar';

import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada.component';

import { UsuarioService } from '../acesso/usuario.service';
import { ErrorHandlerService } from './error-handler.service';
import { NavbarComponent } from './navbar/navbar.component';
import { GrupoService } from '../auxiliares/grupo.service';
import { ClienteService } from '../cliente/cliente.service';
import { BairroService } from '../auxiliares/bairro.service';
import { CidadeService } from '../auxiliares/cidade.service';
import { MotivoOsService } from '../auxiliares/motivo-os.service';
import { OrdemServicoService } from '../ordem-servico/ordem-servico.service';
import { DvrService } from '../dvr/dvr.service';
import { GrupoAcessoService } from '../acesso/grupo-acesso.service';
import { VerificacaoService } from '../verificacao/verificacao.service';
import { AuthService } from '../seguranca/auth.service';
import { NaoAutorizadoComponent } from './nao-autorizado.component';
import { BadgeModule } from 'primeng/badge';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ProfileService } from '../profile/profile.service';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MenuModule,
    AvatarModule,
    PanelMenuModule,
    ConfirmDialogModule,
    ToastModule,
    OverlayPanelModule,
    BadgeModule,
    RouterModule,
    TooltipModule,
    SplitButtonModule,
    SidebarModule,
    ToolbarModule,
  ],
  declarations: [
    NavbarComponent,
    PaginaNaoEncontradaComponent,
    NaoAutorizadoComponent,
  ],
  exports: [
    ConfirmDialogModule,
    ToastModule,
    NavbarComponent,
    NaoAutorizadoComponent,
  ],
  providers: [
    UsuarioService,
    ConfirmationService,
    MessageService,
    ErrorHandlerService,
    GrupoService,
    CidadeService,
    GrupoAcessoService,
    BairroService,
    ClienteService,
    DvrService,
    AuthService,
    MotivoOsService,
    OrdemServicoService,
    VerificacaoService,
    AtendimentoService,
    InformacaoService,
    JwtHelperService,
    ProdutoService,
    FabricanteService,
    ProfileService,
  ],
})
export class CoreModule {}
