import { Component } from '@angular/core';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-helper-cards',
  imports: [NgbDropdownModule, Card],
  templateUrl: './helper-cards.html',
  styleUrl: './helper-cards.scss',
})
export class HelperCards {}
