import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../shared/components/ui/card/card';
import { socialShareOptions } from '../../../../shared/data/product';

@Component({
  selector: 'app-product-content',
  imports: [
    NgbRatingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    Card,
    NgClass,
  ],
  templateUrl: './product-content.html',
  styleUrl: './product-content.scss',
})
export class ProductContent {
  public ctrl = new FormControl<number | null>(null, Validators.required);
  public readonly: boolean = false;
  public socialShareOptions = socialShareOptions;
  public counter: number = 1;

  changeValue(value: number) {
    if (value == -1) {
      if (this.counter > 1) {
        this.counter -= 1;
      }
    } else if (value == 1) {
      this.counter += 1;
    }
  }
}
