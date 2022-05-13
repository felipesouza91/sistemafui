import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-nao-autorizado',
  template: `
    <div class="container">
      <div class="p-col p-grid p-justify-center	">
        <i class="fas fa-lock"></i>
      </div>
      <div class="p-col p-grid p-justify-center	">
        <h1>Acesso Não Autorizado</h1>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        margin-top: 198px;
      }
      .box {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      i {
        font-size: 218px;
      }
    `,
  ],
})
export class NaoAutorizadoComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
