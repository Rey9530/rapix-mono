import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { completedCourses } from '../../../../../shared/data/dashboard/online-course';
import { ITableConfigs } from '../../../../../shared/interface/common';
import { ICompletedCourses } from '../../../../../shared/interface/dashboard/online-course';

@Component({
  selector: 'app-completed-courses',
  imports: [Card, Table],
  templateUrl: './completed-courses.html',
  styleUrl: './completed-courses.scss',
})
export class CompletedCourses {
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  public cardToggleOptions = cardToggleOptions3;

  public tableConfig: ITableConfigs<ICompletedCourses> = {
    columns: [
      { title: 'Student Name', field_value: 'student_name', sort: true },
      { title: 'Course Name', field_value: 'course_name', sort: true },
      { title: 'Completion Date', field_value: 'completion_date', sort: true },
      { title: 'Mentor Name', field_value: 'mentor_name', sort: true },
    ],
    data: [] as ICompletedCourses[],
  };

  ngOnInit() {
    window.navigate = () => {
      void this.router.navigate(['/courses/courses-details']);
    };

    this.tableConfig.data = completedCourses.map(
      (course: ICompletedCourses) => {
        const formattedCourse = { ...course };
        formattedCourse.student_name = this.sanitizer
          .bypassSecurityTrustHtml(`<div class="common-flex align-items-center">
                                  <img class="img-fluid" src="${course.student_profile}" alt="user">
                                  <a class="f-w-500" href="javascript:void(0)"  onclick="navigate()">
                                    ${course.student_name}
                                  </a>
                                </div>`);

        return formattedCourse;
      },
    );
  }
}
