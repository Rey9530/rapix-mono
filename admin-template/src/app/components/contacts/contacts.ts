import { Component, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ContactHistory } from './widgets/contact-history/contact-history';
import { EditContact } from './widgets/edit-contact/edit-contact';
import { PrintContactModal } from './widgets/print-contact-modal/print-contact-modal';
import { Sidebar } from './widgets/sidebar/sidebar';
import { IContact, IContactSidebarList } from '../../shared/interface/contacts';
import { ContactService } from '../../shared/services/contact.service';

@Component({
  selector: 'app-contacts',
  imports: [Sidebar, EditContact, ContactHistory],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class Contacts {
  private modal = inject(NgbModal);
  public contactService = inject(ContactService);

  public edit: boolean = false;
  public history: boolean = false;

  handleCurrentTab(tab: IContactSidebarList) {
    this.contactService.handleCurrentTab(tab);
  }

  filteredContact() {
    this.contactService.filteredContact();
  }

  handleContact(contact: IContact) {
    this.contactService.activeContact = contact;
  }

  editContact() {
    this.edit = true;
  }

  handleEdit(value: boolean) {
    this.edit = value;
  }

  deleteContact(contact: IContact) {
    this.contactService.deleteContact(contact);
  }

  showHistory() {
    this.history = true;
  }

  handleHistory(value: boolean) {
    this.history = value;
  }

  printContact() {
    const modelRef = this.modal.open(PrintContactModal, {
      centered: true,
      modalDialogClass: 'modal-bookmark',
    });
    modelRef.componentInstance.activeContact =
      this.contactService.activeContact;
  }
}
