import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manage-api-modal',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './manage-api-modal.html',
  styleUrl: './manage-api-modal.scss',
})
export class ManageApiModal {
  private modal = inject(NgbActiveModal);

  public validationForm = new FormGroup({
    api_name: new FormControl('', Validators.required),
    api_key: new FormControl('', Validators.required),
  });

  submitForm() {
    this.validationForm.markAllAsTouched();
    if (this.validationForm.valid) {
      this.closeModal();
    }
  }

  closeModal() {
    this.modal.close();
  }
}
