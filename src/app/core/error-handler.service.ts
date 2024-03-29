import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';

import { NotAuthenticationErro } from '../seguranca/app-http-interceptor';
import { AuthService } from '../seguranca/auth.service';

@Injectable()
export class ErrorHandlerService {
  constructor(private router: Router, private messageService: MessageService, private authService: AuthService) {}

  handler(errorResponse: any) {
    let msg: string;
    if (typeof errorResponse === 'string') {
      msg = errorResponse;
    } else if (errorResponse instanceof NotAuthenticationErro) {
      msg = 'Sua sessão expirou !';
      this.authService.login();
    } else if (
      errorResponse instanceof HttpErrorResponse &&
      errorResponse.status >= 400 &&
      errorResponse.status <= 499
    ) {
      msg = 'Ocorreu um erro ao processar a sua solicitação';

      if (errorResponse.status === 403) {
        msg = 'Sem permissão para executar a ação !';
      }
      if (errorResponse.status === 404) {
        msg = 'Os dados solicitados não foram encontrados no servidor !';
      }
      try {
        msg = errorResponse.error.detail;
      } catch (e) {}
    } else {
      msg =
        'Erro ao processar serviço remoto. Tente novamente ou informe para o desenvolvedor.';
      console.error('Ocorreu um erro', errorResponse);
    }
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: msg,
    });
  }
}
