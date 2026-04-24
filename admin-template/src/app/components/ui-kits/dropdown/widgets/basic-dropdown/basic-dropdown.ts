import { Component } from '@angular/core';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';
import { basicDropdown } from '../../../../../shared/data/ui-kits/dropdown';

@Component({
  selector: 'app-basic-dropdown',
  imports: [NgbDropdownModule, Card],
  templateUrl: './basic-dropdown.html',
  styleUrl: './basic-dropdown.scss',
})
export class BasicDropdown {
  public basicDropdown = basicDropdown;
}
