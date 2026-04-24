import { TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';
import { roundedDropdown } from '../../../../../shared/data/ui-kits/dropdown';

@Component({
  selector: 'app-rounded-dropdown',
  imports: [NgbDropdownModule, TitleCasePipe, Card],
  templateUrl: './rounded-dropdown.html',
  styleUrl: './rounded-dropdown.scss',
})
export class RoundedDropdown {
  public roundedDropdown = roundedDropdown;
}
