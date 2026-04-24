import { Component } from '@angular/core';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-unique-dropdown',
  imports: [NgbDropdownModule, Card],
  templateUrl: './unique-dropdown.html',
  styleUrl: './unique-dropdown.scss',
})
export class UniqueDropdown {}
