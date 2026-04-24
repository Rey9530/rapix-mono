import { SlicePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions3 } from '../../../../../shared/data/common';

@Component({
  selector: 'app-school-calendar',
  imports: [NgbDatepickerModule, FormsModule, Card, SlicePipe],
  templateUrl: './school-calendar.html',
  styleUrl: './school-calendar.scss',
})
export class SchoolCalendar {
  public cardToggleOption = cardToggleOptions3;

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
