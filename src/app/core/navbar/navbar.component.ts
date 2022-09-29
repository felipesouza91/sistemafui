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
import { SidebarModule } from 'primeng/sidebar';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  @ViewChild('sideBar', { static: true }) sideBar!: ViewChild;
  display = false;
  showSidebar = false;
  items!: MenuItem[];
  smallItems!: MenuItem[];
  @Output() atendimento = new EventEmitter<boolean>();
  nomeUsuario!: String;
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

  initMenu() {
    this.items = [
      {
        label: 'Menu',
        icon: 'pi pi-bars',
        command: () => this.showMenu(),
      },
      {
        label: 'Cliente',
        icon: 'fas fa-user',
        command: () => (!this.display ? this.showMenu() : null),
        items: [
          {
            label: 'Novo',
            icon: 'fas fa-plus',
            routerLink: 'cliente/novo',
            visible: this.auth.temPermissao('1'),
            command: () => this.closeSideBar(),
          },
          {
            label: 'Pesquisar',
            icon: 'fas fa-search',
            routerLink: '/cliente',
            visible: this.auth.temPermissao('2'),
            command: () => this.closeSideBar(),
          },
        ],
      },
      {
        label: 'Ordem de Serviço',
        icon: 'fas fa-wrench',
        command: () => (!this.display ? this.showMenu() : null),
        items: [
          {
            label: 'Pesquisa',
            icon: 'fas fa-search',
            routerLink: 'ordemservico',
            visible: this.auth.temPermissao('21'),
            command: () => this.closeSideBar(),
          },
          {
            label: 'Nova Ordem',
            icon: 'fas fa-plus',
            visible: this.auth.temPermissao('19'),
            command: () => this.closeSideBar(),
          },
          {
            label: 'Fechamento Ordem',
            icon: 'fas fa-envelope',
            visible: this.auth.temPermissao('24'),
            command: () => this.closeSideBar(),
          },
        ],
      },
      {
        label: 'Verificações',
        command: () => (!this.display ? this.showMenu() : null),
        icon: 'fa fa-fw fa-edit',
        items: [
          {
            label: 'Pesquisa',
            icon: 'fas fa-search',
            visible: this.auth.temPermissao('27'),
            command: () => this.closeSideBar(),
          },
          {
            label: 'Nova Verificação',
            icon: 'fas fa-plus',
            visible: this.auth.temPermissao('25'),
            command: () => this.closeSideBar(),
          },
        ],
      },
      {
        label: 'Configurações',
        command: () => (!this.display ? this.showMenu() : null),
        icon: 'fas fa-cogs',
        items: [
          {
            label: 'Acessos',
            items: [
              {
                label: 'Usuario',
                routerLink: 'usuario',
                visible: this.auth.temPermissao('30'),
                command: () => this.closeSideBar(),
              },
              {
                label: 'Grupo de Acesso',
                routerLink: 'grupoacesso',

                visible: this.auth.temPermissao('33'),
                command: () => this.closeSideBar(),
              },
            ],
          },
          {
            label: 'Auxiliares',
            items: [
              {
                label: 'Cidade',
                routerLink: 'cidade',
                command: () => this.closeSideBar(),
                visible: this.auth.temPermissao('9'),
              },
              {
                label: 'Bairro',
                routerLink: 'bairro',
                command: () => this.closeSideBar(),
                visible: this.auth.temPermissao('12'),
              },
              {
                label: 'Grupo',
                routerLink: 'grupo',
                command: () => this.closeSideBar(),
                visible: this.auth.temPermissao('6'),
              },
              {
                label: 'Motivo Ordem Serviço',
                routerLink: 'motivo-os',
                command: () => this.closeSideBar(),
                visible: this.auth.temPermissao('17'),
              },
              {
                label: 'Fabricante',
                routerLink: 'fabricante',
                command: () => this.closeSideBar(),
                visible: this.auth.temPermissao('38'),
              },
              {
                label: 'Produtos',
                routerLink: 'produto',
                command: () => this.closeSideBar(),
                visible: this.auth.temPermissao('42'),
              },
            ],
          },
        ],
      },
      {
        label: 'Sair',
        icon: 'fas fa-power-off',
        command: () => {
          this.sair();
          this.closeSideBar();
        },
      },
    ];
    this.smallItems = this.items.map((item) => ({
      icon: item.icon,
      command: item.command,
    }));
  }

  sair(): void {
    this.logoutService
      .logout()
      .then(() => {
        this.auth.login();
      })
      .catch((erro) => this.erroService.handler(erro));
  }

  showMenu(): void {
    this.display = !this.display;
  }

  changeSideBarStatus() {
    this.showSidebar = !this.showSidebar;
  }

  closeSideBar() {
    this.showSidebar = false;
  }
}
