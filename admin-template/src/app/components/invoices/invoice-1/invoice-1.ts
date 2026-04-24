import { Component } from '@angular/core';

import { NgxPrintModule } from 'ngx-print';

@Component({
  selector: 'app-invoice-1',
  imports: [NgxPrintModule],
  templateUrl: './invoice-1.html',
  styleUrl: './invoice-1.scss',
})
export class Invoice1 {}
