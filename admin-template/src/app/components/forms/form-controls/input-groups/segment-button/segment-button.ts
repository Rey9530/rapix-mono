import { Component } from '@angular/core';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-segment-button',
  imports: [Card, NgbDropdownModule],
  templateUrl: './segment-button.html',
  styleUrl: './segment-button.scss',
})
export class SegmentButton {}
