import { Component } from '@angular/core';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-input-type-dropdown',
  imports: [NgbDropdownModule, Card],
  templateUrl: './input-type-dropdown.html',
  styleUrl: './input-type-dropdown.scss',
})
export class InputTypeDropdown {}
