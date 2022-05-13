import { AuthService } from './../../seguranca/auth.service';
import { Dvr } from './../../core/mode';
import { DvrService } from '../dvr.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-cadastro-dvr',
  templateUrl: './cadastro-dvr.component.html',
  styleUrls: ['./cadastro-dvr.component.css'],
})
export class CadastroDvrComponent implements OnInit, AfterViewInit {
  formDvr: FormGroup;

  @ViewChild('panel') panel;
  @Input() dvr: any;
  @Input() cliente: number;
  @Input() display = false;
  @Output() closed = new EventEmitter<Boolean>();

  status = [
    { label: 'Ativo', value: true },
    { label: 'Desativo', value: false },
  ];
  fabricantes = [
    { value: 'INTELBRAS', label: 'INTELBRAS' },
    { value: 'TECVOZ', label: 'TECVOZ' },
    { value: 'HIKIVISON', label: 'HIKIVISON' },
  ];

  constructor(
    private cd: ChangeDetectorRef,
    public auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private messageService: MessageService,
    private dvrService: DvrService
  ) {}

  ngOnInit() {
    this.criarFormulario();
    if (this.dvr) {
      if (this.dvr.fabricante !== 'INTELBRAS') {
        this.edicaoDeValidacao(this.dvr.fabricante);
      }
      this.formDvr.patchValue(this.dvr);
    }
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  fechado() {
    this.closed.emit(true);
  }

  edicaoDeValidacao(valor: string) {
    if (this.formDvr.get('fabricante').value === 'INTELBRAS') {
      this.formDvr
        .get('numeroSerie')
        .setValidators([
          Validators.required,
          Validators.minLength(7),
          Validators.maxLength(50),
        ]);
    } else {
      this.formDvr.get('numeroSerie').setValue(null);
      this.formDvr.get('numeroSerie').setValidators(null);
      this.formDvr.get('numeroSerie').reset();
    }
  }

  criar() {
    if (this.dvr) {
      this.editar();
    } else {
      this.novo();
    }
  }

  editar() {
    this.dvrService
      .editar(this.formDvr.value as Dvr)
      .then((resp) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Dvr atualizado com sucesso!',
        });
        this.display = false;
      })
      .catch((error) => this.errorHandler.handler(error));
  }

  novo() {
    this.formDvr.get('cliente').get('id').setValue(this.cliente);
    this.dvrService
      .salvar(this.formDvr.value)
      .then((resp) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Dvr cadastrado com sucesso!',
        });
        this.display = false;
      })
      .catch((error) => this.errorHandler.handler(error));
  }

  limparForm() {
    this.formDvr.reset();
  }

  criarFormulario() {
    this.formDvr = new FormGroup({
      id: new FormControl(null),
      habilitaVerificao: new FormControl(null, Validators.required),
      portaHttp: new FormControl(null, Validators.required),
      portaServico: new FormControl(null, Validators.required),
      fabricante: new FormControl(null, Validators.required),
      modeloDvr: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50),
      ]),
      numeroSerie: new FormControl(null, [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(50),
      ]),
      ip: new FormControl(null, Validators.required),
      mascara: new FormControl(null, Validators.required),
      gateway: new FormControl(null, Validators.required),
      somenteCloud: new FormControl(),
      dnsPrincipal: new FormControl(null, Validators.required),
      dnsAlternativo: new FormControl(null),
      ultimoStatus: new FormControl(null),
      cliente: new FormGroup({
        id: new FormControl(this.cliente, Validators.required),
      }),
    });
  }
}
