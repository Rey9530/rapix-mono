import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { cardToggleOptions1 } from '../../../../../shared/data/common';
import { unPaidFees } from '../../../../../shared/data/dashboard/school-management';
import { ITableConfigs } from '../../../../../shared/interface/common';
import { IUnPaidFees } from '../../../../../shared/interface/dashboard/school-management';

@Component({
  selector: 'app-unpaid-fees',
  imports: [Table, Card],
  templateUrl: './unpaid-fees.html',
  styleUrl: './unpaid-fees.scss',
})
export class UnpaidFees {
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  public unPaidFees = unPaidFees;
  public cardToggleOption = cardToggleOptions1;

  public tableConfig: ITableConfigs<IUnPaidFees> = {
    columns: [
      { title: 'Name', field_value: 'name', sort: true },
      { title: 'ID', field_value: 'student_id', sort: true },
      { title: 'Standard', field_value: 'standard', sort: true },
      { title: 'Section', field_value: 'section', sort: true },
      { title: 'Fees', field_value: 'fees', sort: true },
      { title: 'Due Date', field_value: 'due_date', sort: true },
    ],
    data: [] as IUnPaidFees[],
  };

  ngOnInit() {
    window.navigate = () => {
      void this.router.navigate(['/user/user-profile/1']);
    };

    this.tableConfig.data = unPaidFees.map((student: IUnPaidFees) => {
      const formattedStudents = { ...student };
      formattedStudents.name = this.sanitizer
        .bypassSecurityTrustHtml(`<div class="common-align justify-content-start">
                                  <img class="img-fluid img-40 rounded-circle me-2" src="${student.image}" alt="user">
                                    <div class="img-content-box">
                                    <a class="f-w-500" href="javascript:void(0)" onclick="navigate()">${student.name}</a></div>
                                </div>`);

      return formattedStudents;
    });
  }
}
