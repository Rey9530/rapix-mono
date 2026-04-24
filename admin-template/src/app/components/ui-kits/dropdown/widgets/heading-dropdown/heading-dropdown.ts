import { Component } from '@angular/core';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-heading-dropdown',
  imports: [NgbDropdownModule, Card],
  templateUrl: './heading-dropdown.html',
  styleUrl: './heading-dropdown.scss',
})
export class HeadingDropdown {}
