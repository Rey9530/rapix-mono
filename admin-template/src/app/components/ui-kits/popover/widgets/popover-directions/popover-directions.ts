import { Component } from '@angular/core';

import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-popover-directions',
  imports: [NgbPopoverModule, Card],
  templateUrl: './popover-directions.html',
  styleUrl: './popover-directions.scss',
})
export class PopoverDirections {}
