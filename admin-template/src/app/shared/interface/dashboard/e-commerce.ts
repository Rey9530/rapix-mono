import { SafeHtml } from '@angular/platform-browser';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexDataLabels,
  ApexStroke,
  ApexGrid,
  ApexXAxis,
  ApexYAxis,
  ApexLegend,
  ApexTooltip,
  ApexResponsive,
  ApexPlotOptions,
  ApexStates,
  ApexMarkers,
} from 'ng-apexcharts';

import { IImages } from './default';

export interface ITopCustomers {
  id: number;
  customer_name: string;
  customer_profile: string;
  customer_email: string;
}

export interface IRecentTransactions {
  id: number;
  transaction_id: string;
  date: string;
  customer_name: string;
  product_name: string;
  quantity: number;
  payments: string;
  total: number;
}

export interface IBestSeller {
  id: number;
  seller_name: SafeHtml;
  seller_profile: string;
  company_name: string;
  category: string;
  earning: number;
}

export interface IStockReport {
  id: number;
  product_name: SafeHtml;
  product_image: string;
  product_id: string;
  quantity: number;
  price: number;
  status: SafeHtml;
  color: string;
}

export interface ICategories {
  id: number;
  title: string;
  image: string;
  value: string;
}

export interface IRecentOrders {
  id: number;
  title: string;
  product_id: string;
  image: string;
  quantity: string;
  price: number;
  total_price: number;
  category: string;
}

export interface ITopCategories {
  id: number;
  category_name: string;
  image: string;
  total_items: number;
}

export interface IRecentActivity {
  id: number;
  title: string;
  description: string;
  date: string;
  color: string;
  images?: IImages[];
}

export interface ITrendingProducts {
  id: number;
  product_name: SafeHtml;
  product_image: string;
  category: string;
  sold_item: number;
}

export interface ISlot {
  slot: string;
  time: string;
}

export interface IMonthOrderChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  colors: string[];
  fill: ApexFill;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  grid: ApexGrid;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  responsive: ApexResponsive[];
  monthOrder: number;
  totalOrderGoal: number;
}

export interface IMonthlyProfitsChart {
  labels: string[];
  series: number[];
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  stroke: ApexStroke;
  plotOptions: ApexPlotOptions;
  states: ApexStates;
  colors: string[];
  responsive: ApexResponsive[];
}

export interface IWebsiteTrafficChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  grid: ApexGrid;
  colors: string[];
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  fill: ApexFill;
  legend: ApexLegend;
  responsive: ApexResponsive[];
}

export interface IOrderOverviewChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  grid: ApexGrid;
  plotOptions: ApexPlotOptions;
  colors: string[];
  fill: ApexFill;
  labels: string[];
  markers: ApexMarkers;
  xaxis: ApexXAxis;
  legend: ApexLegend;
  yaxis: ApexYAxis;
  tooltip: ApexTooltip;
  responsive: ApexResponsive[];
}
export interface IOrderOverviewBarChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  colors: string[];
  grid: ApexGrid;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  states: ApexStates;
  chartLabelsDetails: IOrderOverviewBarChartDetails[];
  orderDetails: IOrderDetails[];
}

export interface IOrderOverviewBarChartDetails {
  id: number;
  label: string;
  color: string;
}

export interface IOrderDetails {
  id: number;
  title: string;
  value: string;
  icon: string;
}
