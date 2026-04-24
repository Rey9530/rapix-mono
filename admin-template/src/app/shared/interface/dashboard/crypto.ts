import { SafeHtml } from '@angular/platform-browser';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexStroke,
  ApexDataLabels,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip,
  ApexLegend,
  ApexResponsive,
} from 'ng-apexcharts';

export interface IAverageDayDetails {
  id: number;
  title: string;
  description: string;
  value: string;
  margin: string;
  margin_type: string;
  color: string;
  chart_details: IAverageDayChartDetails;
}
export interface IAverageDayChartDetails {
  series: number[];
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  colors: string[];
  stroke: ApexStroke;
  responsive: ApexResponsive[];
}
export interface IAverageDayChartOptions {
  color: string[];
  dropShadowColor: string;
  radialYSeries: number[];
}
export interface ITransactions {
  id: number;
  currency: string;
  date: string;
  profit_type: string;
  value: string;
  price: string;
  type: string;
}

export interface ICurrencyChart {
  id: number;
  currency_name: string;
  currency_code: string;
  currency_symbol: string;
  price: number;
  profit: number;
  profit_type: string;
  color: string;
  chart_details: ICurrencyChartDetails;
}
export interface ICurrencyChartDetails {
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

export interface ICurrencyChartOptions {
  color: string[];
  dropShadowColor: string;
  label: string[];
  widgetYSeries: number[];
}
export interface IMyCurrency {
  id: number;
  currency_name: SafeHtml;
  currency_symbol: string;
  price: string;
  day_change: string;
  total_balance: string;
  total_coin: string;
  profit_type: string;
  color: string;
  is_trade?: SafeHtml;
}

export interface IActivities {
  id: number;
  user_name: string;
  user_profile: string;
  transaction_to: string;
  transaction_amount: string;
  transaction_date: string;
  profit_type: string;
}

export interface IAverageSalePrice {
  id: number;
  currency_name: SafeHtml;
  currency_symbol: string;
  usd: string;
  eth: string;
  btc: string;
  price_change: string;
  bg_color: string;
}

export interface ITopPerformers {
  id: number;
  currency_name: SafeHtml;
  currency_symbol: string;
  market_cap: SafeHtml;
  usd: string;
  btc: string;
  eth: string;
  change24h: string;
  bg_color: string;
}

export interface IMarketGraph {
  title: string;
  series: ApexAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  colors: string[];
  grid: ApexGrid;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  labels: string[];
  markers: ApexMarkers;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  chart_details: IMarketGraphChartDetails[];
}

export interface IMarketGraphChartDetails {
  title: string;
  value: string;
  profit_type: string;
}

export interface IMyPortfolio {
  title: string;
  dropdownOption: IDropdownOption[];
  series: number[];
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  colors: string[];
  labels: string[];
  fill: ApexFill;
  responsive: ApexResponsive[];
  chart_details: IMyPortfolioChartDetails[];
}

export interface IDropdownOption {
  id: number;
  title: string;
}

export interface IMyPortfolioChartDetails {
  id: number;
  currency_name: string;
  currency_symbol: string;
  currency_code: string;
  value: string;
  total_price: string;
  profit_type: string;
  icon_color: string;
}
