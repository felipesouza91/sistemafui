import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogModule } from 'primeng/dialog';
import { SharedModule } from 'primeng/api';
import { ErroMessageComponent } from './erro-message/erro-message.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, SharedModule, DialogModule],
  declarations: [ErroMessageComponent],
  exports: [ErroMessageComponent],
})
export class AppSharedModule {}
