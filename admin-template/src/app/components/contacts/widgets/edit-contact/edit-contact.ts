import { Component, input, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { Select2Module } from 'ng-select2-component';

import { contactTypes, urlTypes } from '../../../../shared/data/contacts';
import { IContact } from '../../../../shared/interface/contacts';

@Component({
  selector: 'app-edit-contact',
  imports: [
    NgbDatepickerModule,
    ReactiveFormsModule,
    FormsModule,
    Select2Module,
  ],
  templateUrl: './edit-contact.html',
  styleUrl: './edit-contact.scss',
})
export class EditContact {
  readonly activeContact = input<IContact>();
  readonly edit = output<boolean>();

  public selectedDate?: { year: number; month: number; day: number };
  public contactTypes = contactTypes;
  public urlTypes = urlTypes;

  public moreInformation = false;

  ngOnInit() {
    this.setDate();
  }

  save() {
    this.moreInformation = false;
    this.edit.emit(false);
  }

  setDate() {
    const contact = this.activeContact();

    if (contact?.DOB) {
      const date = new Date(contact.DOB);
      this.selectedDate = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      };
    }
  }

  editMoreInformation() {
    this.moreInformation = true;
  }
}
