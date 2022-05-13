import {ResumoAtendimento} from './../../core/model-resumo';
import {ErrorHandlerService} from './../../core/error-handler.service';
import {AtendimentoService, AtendimentoFilter} from './../atendimento.service';
import {Component, OnInit} from '@angular/core';
import {Atendimento} from 'src/app/core/mode';

@Component({
  selector: 'app-pesquisa-atendimento',
  templateUrl: './pesquisa-atendimento.component.html',
  styleUrls: ['./pesquisa-atendimento.component.css'],
})
export class PesquisaAtendimentoComponent implements OnInit {
  filter = new AtendimentoFilter();
  atendimentos = [{fantazia: 'Felipe'}];
  displayAtendimento = false;
  idAtendimento;
  constructor(
    private erroService: ErrorHandlerService,
    private atendimentoService: AtendimentoService
  ) {}

  ngOnInit() {}

  showDialog(atendimento: Atendimento) {
    this.idAtendimento = atendimento.id;
    this.displayAtendimento = true;
  }

  preencher() {
    this.atendimentoService
      .pesquisarResumo(this.filter)
      .then(resp => {
        this.atendimentos = resp.conteudo;
      })
      .catch(erro => this.erroService.handler(erro));
  }
}
