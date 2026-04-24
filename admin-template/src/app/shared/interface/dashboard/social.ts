import { SafeHtml } from '@angular/platform-browser';

import {
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

export interface ISocialMediaDetails {
  id: number;
  platform_name: string;
  platform_logo: string;
  title: string;
  value: number;
  rate: string;
  type: string;
  chart_details: ISocialMediaChartDetails;
}

export interface ISocialMediaChartDetails {
  series: number[];
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  colors: string[];
  stroke: ApexStroke;
  responsive: ApexResponsive[];
}

export interface ISocialMediaChartOptions {
  color: string[];
  dropShadowColor: string;
  radialYSeries: number[];
}

export interface ICampaigns {
  id: number;
  platform_name: string;
  platform_logo: string;
  campaign: string;
  geo: string;
  profitability: SafeHtml;
  impressions: string;
  status: SafeHtml;
  icon?: string;
}

export interface ISocialAnalyticsChart {
  id: number;
  title: string;
  value: number;
  analytics_value: string;
  analytics_type: string;
  chart_details: ISocialAnalyticsChartDetails;
}

export interface ISocialAnalyticsChartDetails {
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
  responsive: ApexResponsive[];
}

export interface ISocialAnalyticsTabs {
  id: number;
  title: string;
  value: string;
  icon: string;
  bg_color: string;
  icon_color: string;
  class?: string;
}

export interface ISocialAnalytics {
  marker: ISocialAnalyticsMarkers[];
  charts: ISocialAnalyticsChartsDetails[];
}

export interface ISocialAnalyticsMarkers {
  title: string;
  color: string;
}
export interface ISocialAnalyticsChartsDetails {
  value: string;
  chart_details: IAnalyticsChartDetails;
}

export interface IAnalyticsChartDetails {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  colors: string[];
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  fill: ApexFill;
  legend: ApexLegend;
  grid: ApexGrid;
  responsive: ApexResponsive[];
}

export interface ITopPerformers {
  country_name: string;
  country_flag: string;
  total_followers: number;
}

export interface IInstagramSubscribers {
  title: string;
  description: string;
  series: ApexAxisChartSeries;
  chart: ApexChart;
  grid: ApexGrid;
  colors: string[];
  stroke: ApexStroke;
  markers: ApexMarkers;
  tooltip: ApexTooltip;
  xaxis: ApexXAxis;
  fill: ApexFill;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  responsive: ApexResponsive[];
}

export interface IActivityLog {
  icon: string;
  activity: string;
  date: string;
}
