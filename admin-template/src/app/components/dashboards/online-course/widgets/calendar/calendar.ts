import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-calendar',
  imports: [NgbDatepickerModule, FormsModule, Card],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
})
export class Calendar {
  public model: NgbDateStruct | undefined;

  constructor() {
    const today = new Date();
    this.model = {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
    };
  }
}
