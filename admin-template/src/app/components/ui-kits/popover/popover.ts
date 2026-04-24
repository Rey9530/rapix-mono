import { Component } from '@angular/core';

import { BasicPopover } from './widgets/basic-popover/basic-popover';
import { DelayPopover } from './widgets/delay-popover/delay-popover';
import { DisabledPopover } from './widgets/disabled-popover/disabled-popover';
import { DismissiblePopover } from './widgets/dismissible-popover/dismissible-popover';
import { PopoverDirections } from './widgets/popover-directions/popover-directions';

@Component({
  selector: 'app-popover',
  imports: [
    BasicPopover,
    DisabledPopover,
    DelayPopover,
    DismissiblePopover,
    PopoverDirections,
  ],
  templateUrl: './popover.html',
  styleUrl: './popover.scss',
})
export class Popover {}
