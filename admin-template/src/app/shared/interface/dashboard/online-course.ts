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
  ApexStates,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';

export interface ICourse {
  title: string;
  total_course: number;
  icon: string;
  color?: string;
}

export interface ITopMentors {
  id: number;
  mentor_name: SafeHtml;
  mentor_profile: string;
  expertise: string;
  courses: number;
  experience: string;
}

export interface ICompletedCourses {
  id: number;
  student_name: SafeHtml;
  student_profile: string;
  course_name: string;
  completion_date: string;
  mentor_name: string;
}

export interface IMyCourses {
  id: number;
  course_name: string;
  image_url: string;
  icon: string;
}

export interface IUpcomingSchedule {
  id: number;
  course_name: string;
  user_profile: string;
  date: string;
  time: string;
  color: string;
}

export interface IActiveCourse {
  id: number;
  course_name: string;
  course_type: string;
  logo: string;
  chart_details: IActiveCourseChartDetails;
}

export interface IActiveCourseChartDetails {
  series: number[];
  chart: ApexChart;
  colors: string[];
  legend: ApexLegend;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
  plotOptions: ApexPlotOptions;
  states: ApexStates;
}

export interface IActiveCourseChartOptions {
  color: string[];
  lessonYSeries: number[];
}

export interface ITodayProgressChart {
  series: number[];
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  colors: string[];
  labels: string[];
  stroke: ApexStroke;
  legend: ApexLegend;
  responsive: ApexResponsive[];
  title: string;
  description: string;
}

export interface ILearningOverviewChart {
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
  title: string;
  description: string;
}

export interface IActivityHoursChart {
  title: string;
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  colors: string[];
  fill: ApexFill;
  responsive: ApexResponsive[];
  chart_details: IActivityHoursChartDetails[];
}

export interface IActivityHoursChartDetails {
  title: string;
  value: number;
}

export interface IUpcomingCourses {
  title: string;
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  stroke: ApexStroke;
  states: ApexStates;
  responsive: ApexResponsive[];
}
