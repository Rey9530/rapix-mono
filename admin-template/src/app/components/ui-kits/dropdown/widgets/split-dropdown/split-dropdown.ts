import { Component } from '@angular/core';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';
import { splitDropdown } from '../../../../../shared/data/ui-kits/dropdown';

@Component({
  selector: 'app-split-dropdown',
  imports: [NgbDropdownModule, Card],
  templateUrl: './split-dropdown.html',
  styleUrl: './split-dropdown.scss',
})
export class SplitDropdown {
  public splitDropdown = splitDropdown;
}
