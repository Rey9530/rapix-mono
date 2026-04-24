import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { AllProjects } from './widgets/all-projects/all-projects';
import { EstimatedActualChart } from './widgets/estimated-actual-chart/estimated-actual-chart';
import { ExpensesChart } from './widgets/expenses-chart/expenses-chart';
import { PriorityTask } from './widgets/priority-task/priority-task';
import { ProjectAnalysis } from './widgets/project-analysis/project-analysis';
import { RecentActivity } from './widgets/recent-activity/recent-activity';
import { TaskStatistics } from './widgets/task-statistics/task-statistics';
import { TeamPerformance } from './widgets/team-performance/team-performance';
import { TodayTask } from './widgets/today-task/today-task';
import { UpcomingDeadline } from './widgets/upcoming-deadline/upcoming-deadline';
import {
  expensesChart,
  projectDetails,
} from '../../../shared/data/dashboard/projects';
import { Details } from '../projects/widgets/details/details';

@Component({
  selector: 'app-projects',
  imports: [
    Details,
    PriorityTask,
    TaskStatistics,
    TodayTask,
    AllProjects,
    EstimatedActualChart,
    TeamPerformance,
    ExpensesChart,
    UpcomingDeadline,
    ProjectAnalysis,
    RecentActivity,
    NgClass,
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  public projectDetails = projectDetails;
  public expensesChart = expensesChart;
}
