import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-reset-rating',
  imports: [ReactiveFormsModule, NgbRatingModule, Card, NgClass],
  templateUrl: './reset-rating.html',
  styleUrl: './reset-rating.scss',
})
export class ResetRating {
  public ctrl = new FormControl<number | null>(null, Validators.required);
  public readonly: boolean = false;
}
