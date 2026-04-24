import { Component } from '@angular/core';

import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-disabled-popover',
  imports: [NgbPopoverModule, Card],
  templateUrl: './disabled-popover.html',
  styleUrl: './disabled-popover.scss',
})
export class DisabledPopover {}
