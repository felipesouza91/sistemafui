import { MenuItem } from 'primeng/api';
import { Component } from '@angular/core';
import { Router } from '../../node_modules/@angular/router';

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

  constructor(private router: Router) {}

  finalizou(tipo: boolean, tela: number) {
    if (tela === 1) {
      this.displayAtendimento = tipo;
    }
  }

  teste(event: boolean) {
    this.display = true;
  }
}
