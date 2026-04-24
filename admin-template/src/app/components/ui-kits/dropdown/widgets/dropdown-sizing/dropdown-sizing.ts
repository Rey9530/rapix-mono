import { Component } from '@angular/core';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-dropdown-sizing',
  imports: [NgbDropdownModule, Card],
  templateUrl: './dropdown-sizing.html',
  styleUrl: './dropdown-sizing.scss',
})
export class DropdownSizing {}
