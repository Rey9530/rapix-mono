import { Component } from '@angular/core';

import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-dismissible-popover',
  imports: [NgbPopoverModule, Card],
  templateUrl: './dismissible-popover.html',
  styleUrl: './dismissible-popover.scss',
})
export class DismissiblePopover {}
