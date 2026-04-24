import { SafeHtml } from '@angular/platform-browser';

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
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';

export interface IOverview {
  id: number;
  title: string;
  value: string;
  icon: string;
  color: string;
  profit: number;
  profit_type: string;
  class?: string;
  chart_id?: string;
  chart_details?: IOverviewChartDetails;
  progress_bar_details?: IProgressBarDetails;
}

export interface IOverviewChartDetails {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions?: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis;
  grid?: ApexGrid;
  colors: string[];
  fill: ApexFill;
  stroke?: ApexStroke;
  markers?: ApexMarkers;
  responsive?: ApexResponsive[];
}

export interface IProgressBarDetails {
  striped: boolean;
  animated: boolean;
  width: number;
  type: string;
}
export interface IShipmentTracking {
  id: number;
  shipment: SafeHtml;
  carrier: string;
  origin: string;
  destination: string;
  current_location: string;
  eta: string;
  class: string;
  status: string;
}

export interface IShipmentDetails {
  class: string;
  title: string;
  text?: string;
}

export interface IVehiclesOverview {
  id: number;
  vehicle_id: SafeHtml;
  status: string;
  driver_name: string;
  next_due: string;
  total_distance: number;
  location: string;
  image: string;
}

export interface IDeliveryDuration {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  plotOptions: ApexPlotOptions;
  colors: string[];
  fill: ApexFill;
  grid: ApexGrid;
  legend: ApexLegend;
  markers: ApexMarkers;
  annotations: ApexAnnotations;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  responsive: ApexResponsive[];
  details: IDeliveryDurationDetails[];
}

export interface IDeliveryDurationDetails {
  class: string;
  name: string;
}

export interface IFleetStatus {
  labels: string[];
  series: number[];
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  stroke: ApexStroke;
  legend: ApexLegend;
  colors: string[];
  responsive: ApexResponsive[];
}

export interface IOpenSalesOrder {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  grid: ApexGrid;
  title: ApexTitleSubtitle;
  colors: string[];
  fill: ApexFill;
  annotations: ApexAnnotations;
  xaxis: ApexXAxis;
  legend: ApexLegend;
  yaxis: ApexYAxis;
  responsive: ApexResponsive[];
  count: string;
  text: string;
  total_sale: string;
}

export interface IProfitByCountry {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  grid: ApexGrid;
  plotOptions: ApexPlotOptions;
  annotations: ApexAnnotations;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  yaxis: ApexYAxis;
  colors: string[];
  fill: ApexFill;
  responsive: ApexResponsive[];
  details: IProfitByCountryDetails[];
}

export interface IProfitByCountryDetails {
  class: string;
  name: string;
}
