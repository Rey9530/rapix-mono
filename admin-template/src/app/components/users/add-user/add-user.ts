import { Component } from '@angular/core';

import { Select2Module } from 'ng-select2-component';

import { Card } from '../../../shared/components/ui/card/card';
import { country } from '../../../shared/data/country';

@Component({
  selector: 'app-add-user',
  imports: [Select2Module, Card],
  templateUrl: './add-user.html',
  styleUrl: './add-user.scss',
})
export class AddUser {
  public country = country;
}
