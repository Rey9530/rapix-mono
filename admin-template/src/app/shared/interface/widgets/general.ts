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
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';

export interface ILastMonthDetails {
  id: number;
  title: string;
  value: number;
  icon: string;
  color: string;
  progress: number;
  profit: string;
  profit_type: string;
}

export interface ISessionByDeviceChart {
  title: string;
  series: number[];
  labels: string[];
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  colors: string[];
  fill: ApexFill;
  legend: ApexLegend;
  stroke: ApexStroke;
  responsive: ApexResponsive[];
  chart_details: ISessionByDeviceChartDetails[];
}

export interface ISessionByDeviceChartDetails {
  title: string;
  value: number;
  progress: number;
  color: string;
}

export interface ITotalUsersChart {
  title: string;
  value: string;
  icon: string;
  color: string;
  increase_user: string;
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  colors: string[];
  responsive: ApexResponsive[];
}

export interface IPageViewsChart {
  title: string;
  value: string;
  icon: string;
  color: string;
  page_view: string;
  series: ApexAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  fill: ApexFill;
}

export interface IAllVisitsChart {
  title: string;
  total_visitors: string;
  last_week_visitors: string;
  series: ApexAxisChartSeries;
  chart: ApexChart;
  colors: string[];
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  tooltip: ApexTooltip;
  fill: ApexFill;
  annotations: ApexAnnotations;
  responsive: ApexResponsive[];
}
