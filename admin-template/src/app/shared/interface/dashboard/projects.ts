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

export interface IProjectDetails {
  title: string;
  count: number;
  text_class: string;
  icon: string;
  percentage: string;
  class: string;
  image: string;
}

export interface IPriorityTask {
  id: number;
  title: string;
  class: string;
  status: string;
  project: string;
  project_status: string;
  project_name: string;
  complete_status: string;
  customer: ICustomer[];
  progress_class: string;
  progress: string;
  date: string;
}

export interface ICustomer {
  image: string;
  name: string;
}

export interface ITodayTask {
  id: string;
  task: string;
  icon: string;
  class?: string;
}

export interface IAllProjects {
  id: number;
  project_id: SafeHtml;
  name: string;
  image: string;
  project_name: string;
  start_date: string;
  end_date: string;
  priority: string;
  status: string;
  class: string;
}

export interface ITeamPerformance {
  id: number;
  name: SafeHtml;
  assigned: number;
  completed: number;
  rate: string;
}

export interface IExpensesChart {
  id: number;
  title: string;
  count: string;
  class: string;
  icon: string;
  percentage: string;
  chart_id: string;
  chart_details: IExpensesChartDetails;
}

export interface IExpensesChartDetails {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  stroke?: ApexStroke;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  colors: string[];
  fill: ApexFill;
  responsive: ApexResponsive[];
  plotOptions?: ApexPlotOptions;
  tooltip?: ApexTooltip;
  legend?: ApexLegend;
}

export interface IUpcomingDeadline {
  id: number;
  employee: SafeHtml;
  task: string;
  deadline: string;
}

export interface IRecentActivity {
  id: number;
  description: SafeHtml;
  project: string;
  performed_by: string;
  date: string;
}

export interface ITaskStatistics {
  labels: string[];
  series: number[];
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  stroke: ApexStroke;
  plotOptions: ApexPlotOptions;
  states: ApexStates;
  colors: string[];
}

export interface IEstimatedActualChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  colors: string[];
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  xaxis: ApexXAxis;
  responsive: ApexResponsive[];
}

export interface IProjectAnalysis {
  details: IProjectAnalysisDetails[];
  series: ApexAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  plotOptions: ApexPlotOptions;
  colors: string[];
  fill: ApexFill;
  grid: ApexGrid;
  legend: ApexLegend;
  markers: ApexMarkers;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  responsive: ApexResponsive[];
}

export interface IProjectAnalysisDetails {
  name: string;
  class: string;
}
