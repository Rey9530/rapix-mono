import { Component } from '@angular/core';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-dark-dropdown',
  imports: [NgbDropdownModule, Card],
  templateUrl: './dark-dropdown.html',
  styleUrl: './dark-dropdown.scss',
})
export class DarkDropdown {}
