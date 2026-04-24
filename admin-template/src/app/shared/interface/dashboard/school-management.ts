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
  ApexTheme,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';

export interface ISchoolDetails {
  title: string;
  class: string;
  count: string;
  icon: string;
  alt: string;
  percentage: string;
  image: string;
}

export interface ITodayTask {
  id: string;
  checked: boolean;
  title: string;
  class: string;
  icon: string;
  time: string;
  status: string;
  status_class: string;
  tr_class?: string;
}

export interface INoticeBoard {
  class: string;
  date: string;
  title: string;
  time: string;
  badge?: boolean;
}

export interface IShiningStar {
  class?: string;
  image?: string;
  number?: string;
  text?: string;
  user_image: string;
  name: string;
  grade: string;
  percentage: string;
}

export interface IUnPaidFees {
  id: number;
  image: string;
  name: SafeHtml;
  student_id: string;
  standard: string;
  section: string;
  fees: string;
  due_date: string;
}

export interface ITopStudent {
  id: number;
  student_id: string;
  name: SafeHtml;
  marks: number;
  percentage: string;
  year: number;
  standard: string;
  image: string;
  profile_link: string;
}

export interface INewStudentEnroll {
  id: number;
  name: SafeHtml;
  student_id: string;
  standard: string;
  section: string;
  admission_date: string;
  profile_image: string;
  profile_link: string;
}

export interface IAcademicPerformance {
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

export interface ISchoolPerformance {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  grid: ApexGrid;
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

export interface ISchoolFinance {
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
  details: ISchoolFinanceDetails[];
}

export interface ISchoolFinanceDetails {
  title: string;
  count: string;
  class: string;
}

export interface IPerformanceOverview {
  series: number[];
  chart: ApexChart;
  labels: string[];
  fill: ApexFill;
  stroke: ApexStroke;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
  theme: ApexTheme;
  responsive: ApexResponsive[];
  marks: IPerformanceOverviewMarks[];
}

export interface IPerformanceOverviewMarks {
  image: string;
  alt: string;
  title: string;
  text: string;
  mark: number;
  percentage: string;
}

export interface IStudentChart {
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

export interface IAttendance {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  grid: ApexGrid;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  colors: string[];
  fill: ApexFill;
  legend: ApexLegend;
  responsive: ApexResponsive[];
}
