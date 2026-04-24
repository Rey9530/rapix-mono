import { Component } from '@angular/core';

import { CandidateFilter } from './candidate-filter/candidate-filter';
import { Card } from '../../../shared/components/ui/card/card';
import { Table } from '../../../shared/components/ui/table/table';
import { candidateList } from '../../../shared/data/jobs/candidates';
import { ITableConfigs } from '../../../shared/interface/common';
import { ICandidate } from '../../../shared/interface/jobs';

@Component({
  selector: 'app-candidates',
  imports: [CandidateFilter, Card, Table],
  templateUrl: './candidates.html',
  styleUrl: './candidates.scss',
})
export class Candidates {
  public candidateList = candidateList;
  public selected: number[] = [];

  public tableConfig: ITableConfigs<ICandidate> = {
    columns: [
      { title: 'Candidate Name', field_value: 'name', sort: true },
      { title: 'Description', field_value: 'designation', sort: true },
      { title: 'Educations', field_value: 'education', sort: true },
      { title: 'Experience & Skills', field_value: 'experience', sort: true },
    ],
    row_action: [
      { label: 'Message' },
      { label: 'Approve' },
      { label: 'Reject' },
    ],
    data: [] as ICandidate[],
  };

  ngOnInit() {
    this.tableConfig.data = candidateList.map((candidate: ICandidate) => {
      const formattedCandidate = { ...candidate };
      formattedCandidate.name = `<div class="common-flex align-items-center">
                                            <div class="position-relative">
                                                <img class="img-fluid rounded-circle" src="${candidate.img}" alt="user">
                                                <div class="status">
                                                    <div class="inner-dot bg-${candidate.class}"></div>
                                                </div>
                                            </div>
                                            <div><a class="f-w-500" href="javascript:void(0)">${candidate.name}</a>
                                                <p>${candidate.label}</p>
                                            </div>
                                        </div>
                                        <div class="common-f-start">
                                            <div class="attachment">
                                                <i class="fa-solid fa-paperclip"></i>
                                                <span>${candidate.projects} Projects</span>
                                            </div>
                                        </div>`;

      formattedCandidate.designation = `<ul class="candidate-desc">
                                            <li>
                                                <h6>${candidate.designation}</h6>
                                            </li>
                                            <li>
                                                <h6 class="c-light">Salary Range: <span class="f-14">${candidate.salary}</span>
                                                </h6>
                                            </li>
                                        </ul>`;
      if (Array.isArray(candidate.education)) {
        const educationHtml = candidate.education
          .map((edu) => `<p class="mb-0">${edu.degree}</p>`)
          .join('');

        formattedCandidate.education = `${educationHtml}`;
      }

      let skillHtml = '';
      for (let i = 0; i < candidate.skills.length; i++) {
        skillHtml += ` <span class="badge badge-light-${candidate.skills[i]['class']}">
                                                          ${candidate.skills[i]['name']} </span>`;
      }

      formattedCandidate.experience = `<ul class="candidate-skill">
                                            <li>
                                                <p class="mb-2">Experience : <span>${candidate.experience}</span></p>
                                            </li>
                                            <li>
                                             <div class="common-flex">
                                               ${skillHtml}
                                               </div
                                            </li>
                                        </ul>`;

      return formattedCandidate;
    });
  }
}
