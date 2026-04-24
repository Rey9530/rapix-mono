import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexTitleSubtitle,
  ApexTheme,
  ApexMarkers,
  ApexAnnotations,
  ApexGrid,
  ApexResponsive,
} from 'ng-apexcharts';

export interface BasicChart {
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  series: ApexAxisChartSeries;
  title: ApexTitleSubtitle;
  subtitle: ApexTitleSubtitle;
  labels: string[];
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  legend: ApexLegend;
  colors: string[];
}

export interface AreaSpalineChart {
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  series: ApexAxisChartSeries;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  colors: string[];
}

export interface BarChart {
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  series: ApexAxisChartSeries;
  xaxis: ApexXAxis;
  colors: string[];
}

export interface ColumnChart {
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  series: ApexAxisChartSeries;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  colors: string[];
}

export interface BubbleChart {
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  series: ApexAxisChartSeries;
  fill: ApexFill;
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  theme: ApexTheme;
  stroke: ApexStroke;
  colors: string[];
}

export interface StepLineChart {
  chart: ApexChart;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  series: ApexAxisChartSeries;
  title: ApexTitleSubtitle;
  markers: ApexMarkers;
  colors: string[];
}

export interface ColumnChart2 {
  annotations: ApexAnnotations;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  grid: ApexGrid;
  series: ApexAxisChartSeries;
  title: ApexTitleSubtitle;
  labels: string[];
  xaxis: ApexXAxis;
  colors: string[];
}

export interface PieChart {
  chart: ApexChart;
  labels: string[];
  series: number[];
  responsive: ApexResponsive[];
  colors: string[];
}

export interface DonutChart {
  chart: ApexChart;
  series: number[];
  responsive: ApexResponsive[];
  colors: string[];
}

export interface MixChart {
  chart: ApexChart;
  stroke: ApexStroke;
  plotOptions: ApexPlotOptions;
  series: ApexAxisChartSeries;
  fill: ApexFill;
  labels: string[];
  markers: ApexMarkers;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  colors: string[];
}

export interface CandleStickChart {
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  series: ApexAxisChartSeries;
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  colors: string[];
}

export interface RadarChart {
  chart: ApexChart;
  series: ApexAxisChartSeries;
  labels: string[];
  plotOptions: ApexPlotOptions;
  title: ApexTitleSubtitle;
  colors: string[];
  markers: ApexMarkers;
  tooltip: ApexTooltip;
  yaxis: ApexYAxis;
}

export interface RadialBarChart {
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  series: number[];
  labels: string[];
  responsive: ApexResponsive[];
  colors: string[];
}
