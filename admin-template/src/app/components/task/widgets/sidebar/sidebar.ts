import { Component, output, inject } from '@angular/core';

import { NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Select2Module, Select2UpdateEvent } from 'ng-select2-component';

import { FeatherIcon } from '../../../../shared/components/ui/feather-icon/feather-icon';
import { taskImportance, taskStatus } from '../../../../shared/data/tasks';
import { user } from '../../../../shared/data/user';
import { AddTaskModal } from '../add-task-modal/add-task-modal';

@Component({
  selector: 'app-sidebar',
  imports: [Select2Module, NgbDatepickerModule, FeatherIcon],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private modal = inject(NgbModal);

  readonly selectedStatus = output<string>();
  readonly selectedImportance = output<string>();

  public userDetails = user;
  public taskStatus = taskStatus;
  public taskImportance = taskImportance;
  public sidebarOpen: boolean = false;

  handleTaskStatus(event: Select2UpdateEvent) {
    this.selectedStatus.emit(event.value as string);
  }

  handleImportance(event: Select2UpdateEvent) {
    this.selectedImportance.emit(event.value as string);
  }

  openModal() {
    this.modal.open(AddTaskModal, {
      size: 'lg',
      windowClass: 'add-task-modal',
    });
  }

  toggleFilter() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
