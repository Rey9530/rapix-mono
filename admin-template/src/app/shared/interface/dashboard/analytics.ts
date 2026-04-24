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
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';

export interface IReferralsVisit {
  social_network: SafeHtml;
  conversion_rate: SafeHtml;
  visits: string;
  icon_class?: string;
  icon: string;
  class: string;
}

export interface IPageAnalytics {
  id: number;
  page_name: string;
  page_views: string;
  bounce_rate: string;
  click_rate: string;
  devices: string;
  page_icon: string;
  bounce_icon: string;
  click_icon: string;
  page_class: string;
  bounce_class: string;
  click_class: string;
}

export interface ISessionByBrowser {
  browser: string;
  sessions: string;
  image: string;
}

export interface IAnalyticsDetailsChart {
  id: number;
  title: string;
  value: string;
  analytics_value: string;
  txt_class: string;
  image_class: string;
  icon: string;
  image: string;
  chart_id?: string;
  card_body_class?: string;
  body_div_class: string;
  card_class?: string;
  chart_details?: IAnalyticsDetailsChartDetails;
  progress?: boolean;
  user_progress?: boolean;
}

export interface IAnalyticsDetailsChartDetails {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions?: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  colors: string[];
  responsive?: ApexResponsive[];
  stroke?: ApexStroke;
  markers?: ApexMarkers;
  fill?: ApexFill;
}

export interface ISessionByCountries {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  grid: ApexGrid;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  legend: ApexLegend;
  colors: string[];
  fill: ApexFill;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  responsive: ApexResponsive[];
}

export interface IInitialMarkers {
  name: string;
  lat: number;
  lng: number;
  image: string;
}
