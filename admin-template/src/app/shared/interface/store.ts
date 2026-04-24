import { SafeHtml } from '@angular/platform-browser';

import {
  ApexAxisChartSeries,
  ApexFill,
  ApexChart,
  ApexDataLabels,
  ApexStroke,
  ApexTooltip,
  ApexMarkers,
  ApexXAxis,
  ApexYAxis,
  ApexLegend,
  ApexResponsive,
} from 'ng-apexcharts';

export interface IStore {
  id: number;
  store_name: string;
  store_logo: string;
  vendor_name: string;
  total_order: number;
  total_product: number;
  total_earning: number;
  store_category_id: number;
}

export interface IStoreGeneralDetails {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  type?: string;
}

export interface ISalesOverviewCharts {
  id: number;
  title: string;
  value: string;
  icon: string;
  color: string;
  chart_details: ISalesOverviewChartDetails;
}

export interface ISalesOverviewChartDetails {
  series: ApexAxisChartSeries;
  fill: ApexFill;
  chart: ApexChart;
  colors: string[];
  dataLabels: ApexDataLabels;
  textAnchor: string;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  markers: ApexMarkers;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  responsive: ApexResponsive[];
}

export interface ITopSellingProduct {
  id: number;
  product_name: string;
  product_image: string;
  category: string;
  price: string | number;
  orders: string | number;
  stock: string | number;
  total_amount: string | number;
}

export interface IRecentOrders {
  id: number;
  order_number: string;
  date: string;
  amount: number | string;
  payment: string;
  customer_name: SafeHtml;
  customer_profile: string;
}

export interface ISellerDetails {
  details: IStoreDetail;
  rating: ISellerRating;
  notifications: ISellerNotification;
  policies: ISellerPolicy[];
  review: ISellerReview[];
}

export interface IStoreDetail {
  logo: string;
  store_name: string;
  vendor_name: string;
  location: string;
  phone: string;
  email: string;
  url: string;
}

export interface ISellerRating {
  total_rating: number;
  rating: number;
  rating_count: number[];
}

export interface ISellerNotification {
  notification_list: {
    id: number;
    title: string;
    checked?: boolean;
  }[];
  notification_platform: {
    id: number;
    name: string;
    logo: string;
    checked?: boolean;
  }[];
}
[];

export interface ISellerPolicy {
  title: string;
  policy_text: string;
}

export interface ISellerReview {
  name: string;
  image: string;
  product: string;
  rating: number;
  date: string;
  review_text: string;
}
