import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { cardToggleOptions1 } from '../../../../../shared/data/common';
import { topStudent } from '../../../../../shared/data/dashboard/school-management';
import { ITableConfigs } from '../../../../../shared/interface/common';
import { ITopStudent } from '../../../../../shared/interface/dashboard/school-management';

@Component({
  selector: 'app-top-student',
  imports: [Table, Card],
  templateUrl: './top-student.html',
  styleUrl: './top-student.scss',
})
export class TopStudent {
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  public topStudent = topStudent;
  public cardToggleOption = cardToggleOptions1;

  public tableConfig: ITableConfigs<ITopStudent> = {
    columns: [
      { title: 'ID', field_value: 'student_id', sort: true },
      { title: 'Name', field_value: 'name', sort: true },
      { title: 'Marks', field_value: 'marks', sort: true },
      { title: 'Percentage', field_value: 'percentage', sort: true },
      { title: 'Year', field_value: 'year', sort: true },
      { title: 'Standard', field_value: 'standard', sort: true },
    ],
    data: [] as ITopStudent[],
  };

  ngOnInit() {
    window.navigate = () => {
      void this.router.navigate(['/user/user-profile/1']);
    };

    this.tableConfig.data = topStudent.map((student: ITopStudent) => {
      const formattedStudents = { ...student };
      formattedStudents.name = this.sanitizer
        .bypassSecurityTrustHtml(`<div class="common-align justify-content-start">
                                    <img class="img-fluid img-40 rounded-circle me-2" src="${student.image}" alt="user">
                                    <div class="img-content-box">
                                    <a class="f-w-500" href="javascript:void(0" onclick="navigate()">${student.name}</a>
                                    </div>
                                </div>`);

      return formattedStudents;
    });
  }
}
