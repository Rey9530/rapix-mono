import { Component } from '@angular/core';

import { ApplicationOverview } from './widgets/application-overview/application-overview';
import { AttendanceOverview } from './widgets/attendance-overview/attendance-overview';
import { EmployeeDetails } from './widgets/employee-details/employee-details';
import { EmployeeList } from './widgets/employee-list/employee-list';
import { InterviewSchedule } from './widgets/interview-schedule/interview-schedule';
import { LeaveRequest } from './widgets/leave-request/leave-request';
import { ProjectSummaryCard } from './widgets/project-summary-card/project-summary-card';
import { RecruitmentAnalysis } from './widgets/recruitment-analysis/recruitment-analysis';
import { TodayBirthday } from './widgets/today-birthday/today-birthday';
import { TodaySchedule } from './widgets/today-schedule/today-schedule';
import { employeeDetails } from '../../../shared/data/dashboard/hr';

@Component({
  selector: 'app-hr',
  imports: [
    EmployeeDetails,
    ProjectSummaryCard,
    ApplicationOverview,
    EmployeeList,
    AttendanceOverview,
    TodayBirthday,
    RecruitmentAnalysis,
    TodaySchedule,
    InterviewSchedule,
    LeaveRequest,
  ],
  templateUrl: './hr.html',
  styleUrl: './hr.scss',
})
export class Hr {
  public employeeDetails = employeeDetails;
}
