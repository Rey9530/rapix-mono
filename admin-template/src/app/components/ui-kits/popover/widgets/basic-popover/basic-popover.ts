import { Component } from '@angular/core';

import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-basic-popover',
  imports: [NgbPopoverModule, Card],
  templateUrl: './basic-popover.html',
  styleUrl: './basic-popover.scss',
})
export class BasicPopover {}
