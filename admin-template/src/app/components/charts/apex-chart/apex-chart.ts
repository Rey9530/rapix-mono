import { Component } from '@angular/core';

import { AreaSpalineChart } from './area-spaline-chart/area-spaline-chart';
import { BarChart } from './bar-chart/bar-chart';
import { BasicAreaChart } from './basic-area-chart/basic-area-chart';
import { BubbleChart } from './bubble-chart/bubble-chart';
import { CandlestickChart } from './candlestick-chart/candlestick-chart';
import { ColumnAnnotationChart } from './column-annotation-chart/column-annotation-chart';
import { ColumnChart } from './column-chart/column-chart';
import { DonutChart } from './donut-chart/donut-chart';
import { MixedChart } from './mixed-chart/mixed-chart';
import { PieChart } from './pie-chart/pie-chart';
import { RadarChart } from './radar-chart/radar-chart';
import { RadialBarChart } from './radial-bar-chart/radial-bar-chart';
import { SteplineChart } from './stepline-chart/stepline-chart';

@Component({
  selector: 'app-apex-chart',
  imports: [
    BasicAreaChart,
    AreaSpalineChart,
    BarChart,
    ColumnChart,
    BubbleChart,
    SteplineChart,
    ColumnAnnotationChart,
    PieChart,
    DonutChart,
    MixedChart,
    CandlestickChart,
    RadarChart,
    RadialBarChart,
  ],
  templateUrl: './apex-chart.html',
  styleUrl: './apex-chart.scss',
})
export class ApexChart {}
