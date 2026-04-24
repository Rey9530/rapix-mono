import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Select2Module } from 'ng-select2-component';

import { contactTypes } from '../../../../shared/data/contacts';
import { ContactService } from '../../../../shared/services/contact.service';

@Component({
  selector: 'app-add-contact-modal',
  imports: [ReactiveFormsModule, Select2Module],
  templateUrl: './add-contact-modal.html',
  styleUrl: './add-contact-modal.scss',
})
export class AddContactModal {
  private modal = inject(NgbActiveModal);
  private contactService = inject(ContactService);

  public contactTypes = contactTypes;

  public contactForm = new FormGroup({
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    contact_number: new FormControl('', [
      Validators.required,
      Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
      Validators.minLength(10),
      Validators.maxLength(10),
    ]),
    contactType: new FormControl('', [Validators.required]),
  });

  saveContact() {
    this.contactForm.markAllAsTouched();

    if (this.contactForm.valid) {
      const formValues = this.contactForm.value;

      const newContact = {
        first_name: formValues.first_name!,
        last_name: formValues.last_name!,
        email: formValues.email!,
        contact_number: formValues.contact_number!,
        contact_type: formValues.contactType!,
      };

      this.contactService.addContact(newContact);
      this.modal.close();
      this.contactForm.reset();
    }
  }

  closeModal() {
    this.modal.close();
  }
}
