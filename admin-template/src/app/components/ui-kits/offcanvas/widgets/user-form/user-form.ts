import { Component, inject, Input } from '@angular/core';

import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-form',
  imports: [],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm {
  private offcanvasService = inject(NgbActiveOffcanvas);

  @Input() title: string;

  closeOffcanvas() {
    this.offcanvasService.close();
  }
}
