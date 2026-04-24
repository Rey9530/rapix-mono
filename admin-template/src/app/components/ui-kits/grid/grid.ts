import { Component } from '@angular/core';

import { FlexBehaviors } from './widgets/flex-behaviors/flex-behaviors';
import { GridForColumns } from './widgets/grid-for-columns/grid-for-columns';
import { GridOptions } from './widgets/grid-options/grid-options';
import { HorizontalAlignment } from './widgets/horizontal-alignment/horizontal-alignment';
import { HorizontalGutters } from './widgets/horizontal-gutters/horizontal-gutters';
import { Nesting } from './widgets/nesting/nesting';
import { NoGutters } from './widgets/no-gutters/no-gutters';
import { Offset } from './widgets/offset/offset';
import { Order } from './widgets/order/order';
import { RowColumnGutters } from './widgets/row-column-gutters/row-column-gutters';
import { VerticalAlignment } from './widgets/vertical-alignment/vertical-alignment';
import { VerticalGutters } from './widgets/vertical-gutters/vertical-gutters';

@Component({
  selector: 'app-grid',
  imports: [
    GridOptions,
    GridForColumns,
    FlexBehaviors,
    HorizontalGutters,
    VerticalGutters,
    RowColumnGutters,
    NoGutters,
    VerticalAlignment,
    HorizontalAlignment,
    Nesting,
    Order,
    Offset,
  ],
  templateUrl: './grid.html',
  styleUrl: './grid.scss',
})
export class Grid {}
