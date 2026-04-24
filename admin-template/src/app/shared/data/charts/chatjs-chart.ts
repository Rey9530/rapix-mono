import { ChartDataset, ChartOptions, ChartType } from 'chart.js';

import { primaryColor, secondaryColor } from '../common';

// Bar Chart
export const barChart = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  responsive: false,
  datasets: [
    {
      label: 'My First dataset',
      borderColor: primaryColor,
      backgroundColor: 'rgba(115, 102 ,255, 0.6)',
      borderWidth: 2,
      data: [35, 59, 80, 81, 56, 55, 40],
    },
    {
      label: 'My Second dataset',
      borderColor: secondaryColor,
      backgroundColor: 'rgb(131,131,131,0.6)',
      borderWidth: 2,
      data: [28, 48, 40, 19, 86, 27, 90],
    },
  ],
  barOptions: [
    {
      scaleBeginAtZero: true,
      scaleShowGridLines: true,
      scaleGridLineColor: 'rgba(0,0,0,0.1)',
      scaleGridLineWidth: 1,
      scaleShowHorizontalLines: true,
      scaleShowVerticalLines: true,
      barShowStroke: true,
      barStrokeWidth: 2,
      barValueSpacing: 5,
      barDatasetSpacing: 1,
    },
  ],
};

// Line Graph Data

export var lineGraphLabels: string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
];
export var lineGraphType: ChartType = 'line';
export var lineGraphLegend = false;
export const lineGraphData: ChartDataset[] = [
  {
    label: 'My First dataset',
    fill: true,
    backgroundColor: 'rgba(115, 102, 255, 0.3)',
    borderColor: primaryColor,
    pointBackgroundColor: primaryColor,
    borderWidth: 2,
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: '#000',
    data: [10, 59, 80, 81, 56, 55, 40],
  },
  {
    label: 'My Second dataset',
    fill: true,
    backgroundColor: 'rgba(131, 131, 131, 0.6)',
    borderColor: secondaryColor,
    pointBackgroundColor: secondaryColor,
    pointBorderColor: '#fff',
    borderWidth: 2,
    pointHoverBorderColor: '#000',
    pointHoverBackgroundColor: secondaryColor,
    data: [28, 48, 40, 19, 86, 27, 90],
  },
];

export var lineGraphOptions: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
    },
  },
  scales: {
    x: {
      grid: {
        display: true,
        color: 'rgba(0,0,0,.05)',
      },
    },
    y: {
      grid: {
        display: true,
        color: 'rgba(0,0,0,.05)',
      },
    },
  },
  elements: {
    line: {
      tension: 0.4,
      borderWidth: 2,
      fill: true,
    },
    point: {
      radius: 4,
      borderWidth: 1,
      hitRadius: 20,
    },
  },
};

// radar graph //

export const radarGraphOptions: ChartOptions<'radar'> = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
    },
  },
  scales: {
    r: {
      grid: {
        color: 'rgba(0,0,0,.2)',
        lineWidth: 1,
      },
      angleLines: {
        display: true,
        color: 'rgba(0,0,0,.2)',
        lineWidth: 1,
      },
      pointLabels: {
        font: {
          size: 12,
        },
      },
    },
  },
  elements: {
    line: {
      borderWidth: 2,
      fill: true,
    },
    point: {
      radius: 3,
      borderWidth: 1,
      hitRadius: 20,
    },
  },
};

export var radarGraphLabels: string[] = [
  'Ford',
  'Chevy',
  'Toyota',
  'Honda',
  'Mazda',
];
export var radarGraphType: ChartType = 'radar';
export var radarGraphLegend = false;
export var radarGraphData: ChartDataset<'radar'>[] = [
  {
    label: 'My First dataset',
    backgroundColor: 'rgba(0, 102, 102, 0.2)',
    borderColor: primaryColor,
    pointBackgroundColor: primaryColor,
    pointBorderColor: primaryColor,
    pointHoverBackgroundColor: primaryColor,
    pointHoverBorderColor: 'rgba(0, 102, 102, 0.2)',
    data: [12, 3, 5, 18, 7],
  },
];

//line chart //
export const lineChartOptions: ChartOptions<'line'> = {
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: true,
      },
    },
  },
  responsive: true,
};

// Line chart labels
export const lineChartLabels: string[] = [
  '',
  '10',
  '20',
  '30',
  '40',
  '50',
  '60',
  '70',
  '80',
];

// Line chart type
export const lineChartType: ChartType = 'line';

// Show legend?
export const lineChartLegend = false;

// Line chart data (typed properly)
export const lineChartData: ChartDataset<'line'>[] = [
  {
    label: 'Dataset 1',
    data: [10, 20, 40, 30, 0, 20, 10, 30, 10],
    fill: true,
    backgroundColor: 'rgba(81, 187, 37, 0.2)',
    borderColor: '#51bb25',
    pointBackgroundColor: '#51bb25',
    borderWidth: 2,
  },
  {
    label: 'Dataset 2',
    data: [20, 40, 10, 20, 40, 30, 40, 10, 20],
    fill: true,
    backgroundColor: 'rgba(254, 106, 73, 0.3)',
    borderColor: secondaryColor,
    pointBackgroundColor: secondaryColor,
    borderWidth: 2,
  },
  {
    label: 'Dataset 3',
    data: [60, 10, 40, 30, 80, 30, 20, 90, 0],
    fill: true,
    backgroundColor: 'rgba(0, 102, 102, 0.2)',
    borderColor: primaryColor,
    pointBackgroundColor: primaryColor,
    borderWidth: 2,
  },
];

// doughnutChart //

export const doughnutChartLegend = false;

export const doughnutChartLabels: string[] = [
  'Primary',
  'Secondary',
  'Success',
];

export const doughnutChartData: ChartDataset<'doughnut'>[] = [
  {
    label: 'My First Dataset',
    data: [300, 50, 100],
    backgroundColor: [primaryColor, secondaryColor, '#51bb25'],
    borderWidth: 1, // optional: you can add this
  },
];

export const doughnutChartType: ChartType = 'doughnut';

export const doughnutChartOptions: ChartOptions<'doughnut'> = {
  animation: {
    duration: 0, // this disables animation (equivalent to your `animation: false`)
  },
  responsive: true,
  maintainAspectRatio: false,
};

// polar chart //

export const polarChartLabels: string[] = [
  'Yellow',
  'Sky',
  'Black',
  'Grey',
  'Dark Grey',
];

// Polar chart type
export const polarChartType: ChartType = 'polarArea';

// Polar chart legend
export const polarChartLegend = false;

// Polar chart options (correct type, Chart.js v3+)
export const polarChartOptions: ChartOptions<'polarArea'> = {
  responsive: true,
  scales: {
    r: {
      beginAtZero: true,
      grid: {
        circular: true,
      },
      angleLines: {
        display: true,
      },
      pointLabels: {
        display: true,
      },
    },
  },
  animation: {
    animateRotate: true,
    animateScale: false,
  },
  plugins: {
    legend: {
      display: polarChartLegend,
    },
  },
};

// Polar chart colors → not required as separate variable anymore
// But if you want to keep it:
export const polarChartColors = [
  {
    backgroundColor: [
      primaryColor,
      secondaryColor,
      '#f8d62b',
      '#51bb25',
      '#a927f9',
    ],
    borderColor: '#fff',
  },
];

// Polar chart data (typed)
export const polarChartData: ChartDataset<'polarArea'>[] = [
  {
    label: 'Polar Data',
    data: [300, 50, 100, 40, 120],
    backgroundColor: [
      primaryColor,
      '#f8d62b',
      '#51bb25',
      '#a927f9',
      secondaryColor,
    ],
    borderColor: '#fff',
    borderWidth: 2,
  },
];
