import { SafeHtml } from '@angular/platform-browser';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexStroke,
  ApexGrid,
  ApexTooltip,
  ApexFill,
  ApexMarkers,
  ApexXAxis,
  ApexYAxis,
  ApexResponsive,
  ApexLegend,
  ApexPlotOptions,
  ApexTitleSubtitle,
} from 'ng-apexcharts';

export interface ICrmTodo {
  id: number;
  title: string;
  added_by: string;
}

export interface IDeal {
  id: number;
  deal_id: number;
  deal_name: string;
  amount: string;
  close_date: string;
}

export interface ILead {
  id: number;
  lead_name: SafeHtml;
  lead_profile: string;
  date: string;
  email: string;
  assign_user_name: SafeHtml;
  assign_user_profile: string;
  status: SafeHtml;
}

export interface ILeadSource {
  id: number;
  title: string;
  value: number;
}

export interface ITotalSalesChart {
  title: string;
  date: string;
  total_sale: string;
  profit: string;
  profit_type: string;
  chart_details: ITotalSalesChartDetails;
}

export interface ITotalSalesChartDetails {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  grid: ApexGrid;
  tooltip: ApexTooltip;
  colors: string[];
  fill: ApexFill;
  markers: ApexMarkers;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  responsive: ApexResponsive[];
}

export interface ISalesChart {
  title: string;
  chart_details: ISalesChartDetails;
}

export interface ISalesChartDetails {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  markers: ApexMarkers;
  fill: ApexFill;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
}

export interface IRevenueGrowthChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  fill: ApexFill;
  legend: ApexLegend;
  yaxis: ApexYAxis;
  responsive: ApexResponsive[];
}

export interface IPipelineBreakdownChart {
  chart: IPipelineBreakdownChartOptions;
  chart_details: IPipelineBreakdownChartDetails[];
}

export interface IPipelineBreakdownChartOptions {
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
}
export interface IPipelineBreakdownChartDetails {
  value: string;
  color: string;
}

export interface IFinanceOverviewChart {
  title: string;
  revenue: string;
  expenses: string;
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  grid: ApexGrid;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  fill: ApexFill;
  legend: ApexLegend;
  colors: string[];
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  responsive: ApexResponsive[];
}

export interface ISalesWeekChart {
  chart: ApexChart;
  colors: string[];
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  series: ApexAxisChartSeries;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  responsive: ApexResponsive[];
}
