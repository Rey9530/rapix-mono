import { Component } from '@angular/core';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-divider-dropdown',
  imports: [NgbDropdownModule, Card],
  templateUrl: './divider-dropdown.html',
  styleUrl: './divider-dropdown.scss',
})
export class DividerDropdown {}
