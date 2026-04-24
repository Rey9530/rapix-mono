import { SafeHtml } from '@angular/platform-browser';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexResponsive,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';

export interface ITrendingCreator {
  id: number;
  title: string;
  image: string;
  items: string;
  price: number;
}

export interface IArtwork {
  id: number;
  course_name: SafeHtml;
  course_profile: string;
  course_site: string;
  sale: SafeHtml;
  earnings: SafeHtml;
}

export interface ITrendingBids {
  id: number;
  bead_name: string;
  bead_owner: string;
  owner_profile: string;
  banner: string;
  auction_date: string;
  current_bid: string;
  remaining_time?: string;
}

export interface ITopNFT {
  id: number;
  collection_name: SafeHtml;
  profile: string;
  volume: string;
  profit: SafeHtml;
  profit_type: string;
  items: string;
}

export interface IActivityPanel {
  id: number;
  title: string;
  name: string;
  value: string;
  profile: string;
  follow_button?: boolean;
  image?: string;
  time?: string;
}

export interface ILiveAuction {
  id: number;
  name: string;
  owner_profile: string;
  banner: string;
  high_bid: number;
  total_currency: number;
  auction_date: string;
  remaining_time?: string;
}

export interface ICreator {
  id: number;
  creator_name: SafeHtml;
  creator_profile: string;
  category: string;
  creations: number;
  followers: string;
}

export interface ICollection {
  id: number;
  title: string;
  banner: string;
  created_by: string;
  profile: string;
  items: number;
  likes: string;
}

export interface IArtworkDetails {
  id: number;
  artwork_name: SafeHtml;
  artwork_profile: string;
  owner_name: string;
  total_sales: number;
  total_usd: string;
}

export interface IIncomeChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  colors: string[];
  fill: ApexFill;
}

export interface IAnalyticsCharts {
  id: number;
  title: string;
  color: string;
  value: number;
  profit: number;
  profit_type: string;
  price: string;
  chart_details: IAnalyticsChartsDetails;
}

export interface IAnalyticsChartsOptions {
  color: string[];
  dropShadowColor: string;
  label: string[];
  widgetYSeries: number[];
}
export interface IAnalyticsChartsDetails {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  grid: ApexGrid;
  colors: string[];
  stroke: ApexStroke;
  labels: string[];
  markers: ApexMarkers;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  responsive: ApexResponsive[];
}

export interface IStatistics {
  total_art_sold: number;
  total_earning: number;
  chart_details: IStatisticsChartDetails;
}

export interface IStatisticsChartDetails {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  colors: string[];
  fill: ApexFill;
  responsive: ApexResponsive[];
}
