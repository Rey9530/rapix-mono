import { Component, inject, Input } from '@angular/core';

import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Select2Data, Select2Module } from 'ng-select2-component';

@Component({
  selector: 'app-project-form',
  imports: [Select2Module],
  templateUrl: './project-form.html',
  styleUrl: './project-form.scss',
})
export class ProjectForm {
  private offcanvasService = inject(NgbActiveOffcanvas);

  @Input() title: string;

  public projects: Select2Data = [
    { value: 'Project1', label: 'Project1' },
    { value: 'Project2', label: 'Project2' },
    { value: 'Project3', label: 'Project3' },
  ];

  public projectCount: Select2Data = [
    { value: 'One', label: 'One' },
    { value: 'Two', label: 'Two' },
    { value: 'Three', label: 'Three' },
  ];

  closeOffcanvas() {
    this.offcanvasService.close();
  }
}
