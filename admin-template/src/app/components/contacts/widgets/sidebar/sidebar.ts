import { Component, output, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FeatherIcon } from '../../../../shared/components/ui/feather-icon/feather-icon';
import { contactSidebarList } from '../../../../shared/data/contacts';
import { user } from '../../../../shared/data/user';
import { IContactSidebarList } from '../../../../shared/interface/contacts';
import { AddContactModal } from '../add-contact-modal/add-contact-modal';
import { CategoryModal } from '../category-modal/category-modal';

@Component({
  selector: 'app-sidebar',
  imports: [FeatherIcon],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private modal = inject(NgbModal);

  readonly currentTab = output<IContactSidebarList>();

  public contactSidebarList = contactSidebarList;
  public userDetails = user;
  public activeTab: string = contactSidebarList[0].value
    ? contactSidebarList[0].value
    : '';
  public sidebarOpen: boolean = false;

  ngOnInit() {
    if (this.activeTab) {
      this.currentTab.emit(contactSidebarList[0]);
    }
  }

  handleActiveTab(tab: IContactSidebarList) {
    if (tab.value) {
      this.activeTab = tab.value;
      this.currentTab.emit(tab);
    }
  }

  openContactModal() {
    this.modal.open(AddContactModal, { size: 'lg' });
  }

  openCategoryModal() {
    this.modal.open(CategoryModal);
  }

  toggleFilter() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
