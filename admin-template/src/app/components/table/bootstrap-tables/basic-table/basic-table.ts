import { Component } from '@angular/core';

import { ActiveTables } from './active-tables/active-tables';
import { AnatomyTable } from './anatomy-table/anatomy-table';
import { BasicTableWithBorderBottomColor } from './basic-table-with-border-bottom-color/basic-table-with-border-bottom-color';
import { BootstrapTableWithVariants } from './bootstrap-table-with-variants/bootstrap-table-with-variants';
import { BreakpointSpecific } from './breakpoint-specific/breakpoint-specific';
import { Caption } from './caption/caption';
import { CustomTableColor } from './custom-table-color/custom-table-color';
import { DashedBorder } from './dashed-border/dashed-border';
import { HoverRowTable } from './hover-row-table/hover-row-table';
import { InverseTable } from './inverse-table/inverse-table';
import { InverseTableBackground } from './inverse-table-background/inverse-table-background';
import { NestingTable } from './nesting-table/nesting-table';
import { ResponsiveTable } from './responsive-table/responsive-table';
import { SizingTable } from './sizing-table/sizing-table';
import { StripedColumns } from './striped-columns/striped-columns';
import { StripedRowWithInverseTable } from './striped-row-with-inverse-table/striped-row-with-inverse-table';
import { TableBorders } from './table-borders/table-borders';
import { TableFoot } from './table-foot/table-foot';
import { TableGroupDividers } from './table-group-dividers/table-group-dividers';
import { TableHeadOptions } from './table-head-options/table-head-options';
import { TableWithoutBorders } from './table-without-borders/table-without-borders';
import { VerticalAlignmentTable } from './vertical-alignment-table/vertical-alignment-table';

@Component({
  selector: 'app-basic-table',
  imports: [
    BasicTableWithBorderBottomColor,
    BootstrapTableWithVariants,
    InverseTable,
    HoverRowTable,
    InverseTableBackground,
    Caption,
    TableHeadOptions,
    StripedRowWithInverseTable,
    StripedColumns,
    ActiveTables,
    TableBorders,
    TableWithoutBorders,
    VerticalAlignmentTable,
    NestingTable,
    AnatomyTable,
    TableFoot,
    TableGroupDividers,
    BreakpointSpecific,
    ResponsiveTable,
    SizingTable,
    CustomTableColor,
    DashedBorder,
  ],
  templateUrl: './basic-table.html',
  styleUrl: './basic-table.scss',
})
export class BasicTable {}
