import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { breakpointTable } from '../../../../../shared/data/bootstrap-table';

@Component({
  selector: 'app-breakpoint-specific',
  imports: [Card],
  templateUrl: './breakpoint-specific.html',
  styleUrl: './breakpoint-specific.scss',
})
export class BreakpointSpecific {
  public breakpointTable = breakpointTable;
}
