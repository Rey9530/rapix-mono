import { Component } from '@angular/core';

import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { Select2Module } from 'ng-select2-component';

import { Card } from '../../../../shared/components/ui/card/card';
import { paymentMethod, paymentStatus } from '../../../../shared/data/order';

@Component({
  selector: 'app-order-filter',
  imports: [NgbDatepickerModule, Select2Module, Card],
  templateUrl: './order-filter.html',
  styleUrl: './order-filter.scss',
})
export class OrderFilter {
  public paymentStatus = paymentStatus;
  public paymentMethod = paymentMethod;
}
