import { Component } from '@angular/core';

import { ActiveCourses } from './widgets/active-courses/active-courses';
import { ActivityHours } from './widgets/activity-hours/activity-hours';
import { Advertisement } from './widgets/advertisement/advertisement';
import { Calendar } from './widgets/calendar/calendar';
import { CompletedCourses } from './widgets/completed-courses/completed-courses';
import { Courses } from './widgets/courses/courses';
import { LearningOverview } from './widgets/learning-overview/learning-overview';
import { MyCourse } from './widgets/my-course/my-course';
import { TodayProgress } from './widgets/today-progress/today-progress';
import { TopMentors } from './widgets/top-mentors/top-mentors';
import { UpcomingCourses } from './widgets/upcoming-courses/upcoming-courses';
import { UpcomingSchedule } from './widgets/upcoming-schedule/upcoming-schedule';
import { WelcomeCard } from './widgets/welcome-card/welcome-card';
import { courses } from '../../../shared/data/dashboard/online-course';

@Component({
  selector: 'app-online-course',
  imports: [
    WelcomeCard,
    Courses,
    TodayProgress,
    Advertisement,
    Calendar,
    LearningOverview,
    ActivityHours,
    UpcomingCourses,
    TopMentors,
    CompletedCourses,
    MyCourse,
    UpcomingSchedule,
    ActiveCourses,
  ],
  templateUrl: './online-course.html',
  styleUrl: './online-course.scss',
})
export class OnlineCourse {
  public courses = courses;
}
