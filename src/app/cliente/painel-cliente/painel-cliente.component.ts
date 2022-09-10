import { Cliente } from './../../core/mode';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../cliente.service';

@Component({
  selector: 'app-painel-cliente',
  templateUrl: './painel-cliente.component.html',
  styleUrls: ['./painel-cliente.component.css'],
})
export class PainelClienteComponent implements OnInit {
  c!: Cliente;
  isDataLoad = false;

  constructor(
    private router: Router,
    private errorService: ErrorHandlerService,
    private route: ActivatedRoute,
    private clienteService: ClienteService
  ) {}

  ngOnInit() {
    if (this.route.snapshot.params['codigo']) {
      this.init(this.route.snapshot.params['codigo']);
    } else {
      this.isDataLoad = true;
    }
  }

  init(id: number) {
    this.clienteService
      .pesquisaPorCodigo(id)
      .then((resp) => {
        this.c = resp;
        this.isDataLoad = true;
      })
      .catch((error) => {
        this.router.navigate(['cliente']);
        this.errorService.handler(error);
      });
  }
}
