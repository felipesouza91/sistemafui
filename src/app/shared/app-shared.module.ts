import { ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DialogModule } from "primeng/dialog";
import { SharedModule } from "primeng/api";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, SharedModule, DialogModule],
  declarations: [],
  exports: [],
})
export class AppSharedModule {}
