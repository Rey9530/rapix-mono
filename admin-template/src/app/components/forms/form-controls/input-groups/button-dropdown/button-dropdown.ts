import { Component } from '@angular/core';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-button-dropdown',
  imports: [Card, NgbDropdownModule],
  templateUrl: './button-dropdown.html',
  styleUrl: './button-dropdown.scss',
})
export class ButtonDropdown {}
