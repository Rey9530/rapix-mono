import { Component } from '@angular/core';

import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-delay-popover',
  imports: [NgbPopoverModule, Card],
  templateUrl: './delay-popover.html',
  styleUrl: './delay-popover.scss',
})
export class DelayPopover {}
