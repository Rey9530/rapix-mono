import { Component } from '@angular/core';

import { AdvancedSmilAnimations } from './advanced-smil-animations/advanced-smil-animations';
import { BiPolarBarChart } from './bi-polar-bar-chart/bi-polar-bar-chart';
import { BiPolarLine } from './bi-polar-line/bi-polar-line';
import { DonutSvgAnimate } from './donut-svg-animate/donut-svg-animate';
import { ExtremeResponsive } from './extreme-responsive/extreme-responsive';
import { FilledHolesData } from './filled-holes-data/filled-holes-data';
import { HolesData } from './holes-data/holes-data';
import { HorizontalBarChart } from './horizontal-bar-chart/horizontal-bar-chart';
import { LineChartArea } from './line-chart-area/line-chart-area';
import { SimpleLineChart } from './simple-line-chart/simple-line-chart';
import { StackedBarChart } from './stacked-bar-chart/stacked-bar-chart';
import { SvgPathAnimation } from './svg-path-animation/svg-path-animation';

@Component({
  selector: 'app-chartist-chart',
  imports: [
    AdvancedSmilAnimations,
    SvgPathAnimation,
    DonutSvgAnimate,
    BiPolarLine,
    LineChartArea,
    BiPolarBarChart,
    StackedBarChart,
    HorizontalBarChart,
    ExtremeResponsive,
    SimpleLineChart,
    HolesData,
    FilledHolesData,
  ],
  templateUrl: './chartist-chart.html',
  styleUrl: './chartist-chart.scss',
})
export class ChartistChart {}
