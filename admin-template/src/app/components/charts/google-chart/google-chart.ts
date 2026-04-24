import { Component } from '@angular/core';

import { AreaChart1 } from './area-chart-1/area-chart-1';
import { AreaChart2 } from './area-chart-2/area-chart-2';
import { BarChart2 } from './bar-chart-2/bar-chart-2';
import { ColumnChart1 } from './column-chart-1/column-chart-1';
import { ColumnChart2 } from './column-chart-2/column-chart-2';
import { ComboChart } from './combo-chart/combo-chart';
import { LineChart } from './line-chart/line-chart';
import { PieChart1 } from './pie-chart-1/pie-chart-1';
import { PieChart2 } from './pie-chart-2/pie-chart-2';
import { PieChart3 } from './pie-chart-3/pie-chart-3';
import { PieChart4 } from './pie-chart-4/pie-chart-4';
import { WordTree } from './word-tree/word-tree';

@Component({
  selector: 'app-google-chart',
  imports: [
    AreaChart1,
    AreaChart2,
    ColumnChart1,
    ColumnChart2,
    LineChart,
    ComboChart,
    BarChart2,
    WordTree,
    PieChart1,
    PieChart2,
    PieChart3,
    PieChart4,
  ],
  templateUrl: './google-chart.html',
  styleUrl: './google-chart.scss',
})
export class GoogleChart {}
