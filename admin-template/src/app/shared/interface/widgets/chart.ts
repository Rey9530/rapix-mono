import {
  ApexAnnotations,
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexPlotOptions,
  ApexResponsive,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';

export interface CommonLineCharts {
  id: number;
  title: string;
  value: string;
  description: string;
  increase_value: string;
  chart_details: ChartDetails;
}

export interface CommonLineChartInput {
  categories: string[];
  colors: string;
  series: number[];
}

export interface ChartDetails {
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  fill: ApexFill;
  colors: string[];
  series: ApexAxisChartSeries;
  tooltip: ApexTooltip;
  responsive: ApexResponsive[];
}

export interface MonthlyHistoryChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  colors: string[];
  fill: ApexFill;
  tooltip: ApexTooltip;
  responsive: ApexResponsive[];
}

export interface SkillStatusChart {
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  series: number[];
  labels: string[];
  legend: ApexLegend;
  colors: string[];
  responsive: ApexResponsive[];
}

export interface OrderStatusChart {
  chart_details: OrderStatusChartDetails;
}

export interface OrderStatusChartDetails {
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  colors: string[];
  stroke: ApexStroke;
  fill: ApexFill;
  series: ApexAxisChartSeries;
  title: ApexTitleSubtitle;
  subtitle: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  responsive: ApexResponsive[];
}

export interface OrderStatusChartOption {
  colors: string;
  series: number;
  categories: string;
}

export interface LiveProductChart {
  chart: ApexChart;
  stroke: ApexStroke;
  series: ApexAxisChartSeries;
  fill: ApexFill;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  colors: string[];
  labels: string[];
  markers: ApexMarkers;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis[];
  tooltip: ApexTooltip;
}

export interface TurnOverChart {
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  fill: ApexFill;
  colors: string[];
  series: ApexAxisChartSeries;
  tooltip: ApexTooltip;
}

export interface CryptoCurrencyPriceChart {
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  fill: ApexFill;
  colors: string[];
  series: ApexAxisChartSeries;
  tooltip: ApexTooltip;
  responsive: ApexResponsive[];
}

export interface CryptoAnnotationChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  annotations: ApexAnnotations;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  grid: ApexGrid;
  title: ApexTitleSubtitle;
  colors: string[];
  labels: string[];
  xaxis: ApexXAxis;
  responsive: ApexResponsive[];
}

export interface StockMarketChart {
  series: ApexAxisChartSeries;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  fill: ApexFill;
  chart: ApexChart;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  responsive: ApexResponsive[];
}

export interface FinanceChart {
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  series: ApexAxisChartSeries;
  title: ApexTitleSubtitle;
  subtitle: ApexTitleSubtitle;
  fill: ApexFill;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  responsive: ApexResponsive[];
}

export interface OrderStatusChart2 {
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  grid: ApexGrid;
  fill: ApexFill;
  colors: string[];
  markers: ApexMarkers;
  series: ApexAxisChartSeries;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  responsive: ApexResponsive[];
}

export interface MonthlySalesChart {
  fill: ApexFill;
  colors: string[];
  chart: ApexChart;
  series: ApexAxisChartSeries;
  title: ApexTitleSubtitle;
  stroke: ApexStroke;
  markers: ApexMarkers;
  labels: string[];
}

export interface UsersChart {
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  series: ApexAxisChartSeries;
  fill: ApexFill;
  colors: string[];
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
}
