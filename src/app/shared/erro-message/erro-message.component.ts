import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-erro-message',
  template: `<small class="p-error">{{ message }}</small> `,
})
export class ErroMessageComponent implements OnInit {
  @Input() message!: string;
  constructor() {}
  ngOnInit(): void {}
}
