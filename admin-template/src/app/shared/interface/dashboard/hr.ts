import { SafeHtml } from '@angular/platform-browser';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexForecastDataPoints,
  ApexStroke,
  ApexYAxis,
  ApexXAxis,
  ApexLegend,
  ApexMarkers,
  ApexResponsive,
  ApexPlotOptions,
} from 'ng-apexcharts';

export interface IEmployeeDetails {
  id: number;
  title: string;
  value: number;
  icon: string;
  color: string;
}

export interface IEmployeeList {
  id: number;
  name: SafeHtml;
  employee_id: string;
  email: string;
  joining_date: string;
  role: string;
  image: string;
}

export interface IAttendanceOverview {
  id: number;
  employee_name: SafeHtml;
  designation: string;
  check_in_time: string;
  status: string;
  class: string;
}

export interface IBirthdayUser {
  id: number;
  name: string;
  role: string;
  image: string;
}

export interface IInterviewSchedule {
  name: string;
  role: string;
  image: string;
  date: string;
}

export interface ILeaveRequest {
  id: number;
  name: string;
  reason: string;
  leave_period: string;
  image: string;
  action?: string;
}
export interface IDays {
  id: number;
  day: string;
  date: string;
  value: string;
}

export interface ITodaySchedule {
  title: string;
  participants: IParticipant[];
  schedule_name: string;
  time: string;
  color_class: string;
  value: string;
}

export interface IParticipant {
  image: string;
  alt: string;
}

export interface IApplicationOverview {
  chart: IApplicationOverviewChart;
  chart_details: IApplicationOverviewChartDetails[];
}

export interface IApplicationOverviewChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  colors: string[];
  dataLabels: ApexDataLabels;
  fill: ApexFill;
  forecastDataPoints: ApexForecastDataPoints;
  stroke: ApexStroke;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  legend: ApexLegend;
  markers: ApexMarkers;
  responsive: ApexResponsive[];
}

export interface IApplicationOverviewChartDetails {
  title: string;
  color: string;
}

export interface IRecruitmentAnalysis {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  colors: string[];
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  fill: ApexFill;
  responsive: ApexResponsive[];
  details: IRecruitmentAnalysisDetails[];
}

export interface IRecruitmentAnalysisDetails {
  name: string;
  class: string;
}
