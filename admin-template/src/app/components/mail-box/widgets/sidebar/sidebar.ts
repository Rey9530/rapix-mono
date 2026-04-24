import { Component, output, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AddLabelModal } from '../../../../shared/components/ui/modal/add-label-modal/add-label-modal';
import { SvgIcon } from '../../../../shared/components/ui/svg-icon/svg-icon';
import { emailSidebar, emailTags } from '../../../../shared/data/email';
import { ComposeEmailModal } from '../compose-email-modal/compose-email-modal';

@Component({
  selector: 'app-sidebar',
  imports: [SvgIcon],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private modal = inject(NgbModal);

  readonly currentTab = output<string>();

  public emailSidebar = emailSidebar;
  public emailTags = emailTags;
  public activeTab = 'inbox';

  ngOnInit() {
    this.currentTab.emit(this.activeTab);
  }

  handleTabChange(value: string) {
    this.activeTab = value;
    this.currentTab.emit(this.activeTab);
  }

  composeEmail() {
    this.modal.open(ComposeEmailModal, { size: 'lg' });
  }

  openLabelModal() {
    this.modal.open(AddLabelModal, { size: 'lg' });
  }
}
