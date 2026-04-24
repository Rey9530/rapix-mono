import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { cardToggleOptions1 } from '../../../../../shared/data/common';
import { newStudentEnroll } from '../../../../../shared/data/dashboard/school-management';
import { ITableConfigs } from '../../../../../shared/interface/common';
import { INewStudentEnroll } from '../../../../../shared/interface/dashboard/school-management';

@Component({
  selector: 'app-new-enroll-student',
  imports: [Table, Card],
  templateUrl: './new-enroll-student.html',
  styleUrl: './new-enroll-student.scss',
})
export class NewEnrollStudent {
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  public newStudentEnroll = newStudentEnroll;
  public cardToggleOption = cardToggleOptions1;

  public tableConfig: ITableConfigs<INewStudentEnroll> = {
    columns: [
      { title: 'Name', field_value: 'name', sort: true },
      { title: 'ID', field_value: 'student_id', sort: true },
      { title: 'Standard', field_value: 'standard', sort: true },
      { title: 'Section', field_value: 'section', sort: true },
      { title: 'Admission Date', field_value: 'admission_date', sort: true },
    ],
    data: [] as INewStudentEnroll[],
  };

  ngOnInit() {
    window.navigate = () => {
      void this.router.navigate(['/user/user-profile/1']);
    };

    this.tableConfig.data = newStudentEnroll.map(
      (student: INewStudentEnroll) => {
        const formattedStudents = { ...student };
        formattedStudents.name = this.sanitizer
          .bypassSecurityTrustHtml(` <div class="common-align justify-content-start">
                                      <img class="img-fluid img-40 rounded-circle me-2" src="${student.profile_image}" alt="user">
                                      <div class="img-content-box">
                                      <a class="f-w-500" href="javascript:void(0)" onclick="navigate()">${student.name}</a></div>
                                    </div>`);

        return formattedStudents;
      },
    );
  }
}
