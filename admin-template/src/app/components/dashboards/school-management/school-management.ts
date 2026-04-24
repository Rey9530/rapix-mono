import { Component } from '@angular/core';

import { AcademicPerformance } from './widgets/academic-performance/academic-performance';
import { Attendance } from './widgets/attendance/attendance';
import { IncreaseKnowledge } from './widgets/increase-knowledge/increase-knowledge';
import { NewEnrollStudent } from './widgets/new-enroll-student/new-enroll-student';
import { NoticeBoard } from './widgets/notice-board/notice-board';
import { PerformanceOverview } from './widgets/performance-overview/performance-overview';
import { SchoolCalendar } from './widgets/school-calendar/school-calendar';
import { SchoolDetails } from './widgets/school-details/school-details';
import { SchoolFinance } from './widgets/school-finance/school-finance';
import { SchoolPerformance } from './widgets/school-performance/school-performance';
import { ShinningStars } from './widgets/shinning-stars/shinning-stars';
import { Student } from './widgets/student/student';
import { TodayTask } from './widgets/today-task/today-task';
import { TopStudent } from './widgets/top-student/top-student';
import { UnpaidFees } from './widgets/unpaid-fees/unpaid-fees';
import { schoolDetails } from '../../../shared/data/dashboard/school-management';

@Component({
  selector: 'app-school-management',
  imports: [
    AcademicPerformance,
    SchoolPerformance,
    SchoolDetails,
    SchoolFinance,
    PerformanceOverview,
    SchoolCalendar,
    TodayTask,
    IncreaseKnowledge,
    NoticeBoard,
    ShinningStars,
    UnpaidFees,
    TopStudent,
    Student,
    NewEnrollStudent,
    Attendance,
  ],
  templateUrl: './school-management.html',
  styleUrl: './school-management.scss',
})
export class SchoolManagement {
  public schoolDetails = schoolDetails;
}
