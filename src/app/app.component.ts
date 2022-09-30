import { MenuItem } from 'primeng/api';
import { Component } from '@angular/core';
import { Router } from '../../node_modules/@angular/router';
import { tipoAcesso } from './core/navbar/constants';
import { AuthService } from 'src/app/seguranca/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  displayOs: boolean = false;
  displayAtendimento = false;

  opcoes: MenuItem[] = [
    {
      label: 'Novo Atendimento',
      command: () => (this.displayAtendimento = true),
    },
    {
      label: 'Nova Orden de Servico',
    },
    {
      label: 'Nova Verificao',
    },
  ];
  opt = false;
  display = false;

  constructor(private router: Router, private authService: AuthService) {}

  finalizou(tipo: boolean, tela: number) {
    if (tela === 1) {
      this.displayAtendimento = tipo;
    }
  }

  showNavbar() {
    return this.authService.isLoggedIn();
  }

  teste(event: boolean) {
    this.display = true;
  }
}
