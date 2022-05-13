import { Router } from '@angular/router';
import { ErrorHandlerService } from './../error-handler.service';
import { LogoutService } from './../../seguranca/logout.service';
import { AuthService } from './../../seguranca/auth.service';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  @ViewChild('sideBar', { static: true }) sideBar;
  display = false;
  items: MenuItem[];
  @Output() atendimento = new EventEmitter<Boolean>();
  nomeUsuario: String;
  constructor(
    private logoutService: LogoutService,
    public auth: AuthService,
    private erroService: ErrorHandlerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initMenu();
    this.nomeUsuario = this.auth.jwtPayload ? this.auth.jwtPayload.nome : null;
  }

  novoAccessToken() {
    this.auth.obterNovoAccessToken();
  }

  initMenu() {
    this.items = [
      {
        label: 'Cliente',
        icon: 'fas fa-user',
        items: [
          {
            label: 'Novo',
            icon: 'fas fa-plus',
            routerLink: 'cliente/novo',
            visible: this.auth.temPermissao('1'),
            command: () => this.fechar(),
          },
          {
            label: 'Pesquisar',
            icon: 'fas fa-search',
            routerLink: '/cliente',
            visible: this.auth.temPermissao('2'),
            command: () => this.fechar(),
          },
        ],
      },
      {
        label: 'Ordem de Serviço',
        icon: 'fas fa-wrench',
        items: [
          {
            label: 'Pesquisa',
            icon: 'fas fa-search',
            routerLink: 'ordemservico',
            command: () => this.fechar(),
            visible: this.auth.temPermissao('21'),
          },
          {
            label: 'Nova Ordem',
            icon: 'fas fa-plus',
            command: () => {},
            visible: this.auth.temPermissao('19'),
          },
          {
            label: 'Fechamento Ordem',
            icon: 'fas fa-envelope',
            visible: this.auth.temPermissao('24'),
          },
        ],
      },
      {
        label: 'Verificações',
        icon: 'fa fa-fw fa-edit',
        items: [
          {
            label: 'Pesquisa',
            icon: 'fas fa-search',
            visible: this.auth.temPermissao('27'),
          },
          {
            label: 'Nova Verificação',
            icon: 'fas fa-plus',
            visible: this.auth.temPermissao('25'),
          },
        ],
      },
      {
        label: 'Configurações',
        icon: 'fas fa-cogs',
        items: [
          {
            label: 'Acessos',
            items: [
              {
                label: 'Usuario',
                routerLink: 'usuario',
                command: () => this.fechar(),
                visible: this.auth.temPermissao('30'),
              },
              {
                label: 'Grupo de Acesso',
                routerLink: 'grupoacesso',
                command: () => this.fechar(),
                visible: this.auth.temPermissao('33'),
              },
            ],
          },
          {
            label: 'Auxiliares',
            items: [
              {
                label: 'Cidade',
                routerLink: 'cidade',
                command: () => this.fechar(),
                visible: this.auth.temPermissao('9'),
              },
              {
                label: 'Bairro',
                routerLink: 'bairro',
                command: () => this.fechar(),
                visible: this.auth.temPermissao('12'),
              },
              {
                label: 'Grupo',
                routerLink: 'grupo',
                command: () => this.fechar(),
                visible: this.auth.temPermissao('6'),
              },
              {
                label: 'Motivo Ordem Serviço',
                routerLink: 'motivo-os',
                command: () => this.fechar(),
                visible: this.auth.temPermissao('17'),
              },
              {
                label: 'Fabricante',
                routerLink: 'fabricante',
                command: () => this.fechar(),
                visible: this.auth.temPermissao('38'),
              },
              {
                label: 'Produtos',
                routerLink: 'produto',
                command: () => this.fechar(),
                visible: this.auth.temPermissao('42'),
              },
            ],
          },
        ],
      },
      {
        label: 'Sair',
        icon: 'fas fa-power-off',
        command: () => this.sair(),
      },
    ];
  }

  sair(): void {
    this.logoutService
      .logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((erro) => this.erroService.handler(erro));
  }

  fechar(): void {
    this.sideBar.visible = false;
    this.display = false;
  }

  teste() {
    this.atendimento.emit(true);
  }
}
