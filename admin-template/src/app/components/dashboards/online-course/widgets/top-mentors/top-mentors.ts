import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { topMentors } from '../../../../../shared/data/dashboard/online-course';
import { ITableConfigs } from '../../../../../shared/interface/common';
import { ITopMentors } from '../../../../../shared/interface/dashboard/online-course';

@Component({
  selector: 'app-top-mentors',
  imports: [Card, Table],
  templateUrl: './top-mentors.html',
  styleUrl: './top-mentors.scss',
})
export class TopMentors {
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  public cardToggleOptions = cardToggleOptions3;

  public tableConfig: ITableConfigs<ITopMentors> = {
    columns: [
      { title: 'Mentor Name', field_value: 'mentor_name', sort: true },
      { title: 'Expertise', field_value: 'expertise', sort: true },
      { title: 'Courses', field_value: 'courses', sort: true },
      {
        title: 'Experience',
        field_value: 'experience',
        sort: true,
        text: 'Year',
      },
    ],
    data: [] as ITopMentors[],
  };

  ngOnInit() {
    window.navigate = () => {
      void this.router.navigate(['/courses/courses-list']);
    };

    this.tableConfig.data = topMentors.map((mentor: ITopMentors) => {
      const formattedMentor = { ...mentor };
      formattedMentor.mentor_name = this.sanitizer
        .bypassSecurityTrustHtml(`<div class="common-flex align-items-center">
                                  <img class="img-fluid rounded-circle" src="${mentor.mentor_profile}" alt="user">
                                  <a class="f-w-500" href="javascript:void(0)" onclick="navigate()">${mentor.mentor_name}</a>
                                </div>`);

      return formattedMentor;
    });
  }
}
