import { Component, inject } from '@angular/core';

import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../shared/components/ui/card/card';
import { SizeModal } from '../widgets/size-modal/size-modal';

@Component({
  selector: 'app-full-screen-modals',
  imports: [Card],
  templateUrl: './full-screen-modals.html',
  styleUrl: './full-screen-modals.scss',
})
export class FullScreenModals {
  private modalService = inject(NgbModal);

  public modal: NgbModalRef;

  openModal(value: string) {
    let title = '';

    if (value == 'fullScreen') {
      this.modal = this.modalService.open(SizeModal, {
        fullscreen: true,
        scrollable: true,
        modalDialogClass: 'modal-box',
      });
      title = 'Full Screen Modal';
    } else if (value == 'below-sm') {
      this.modal = this.modalService.open(SizeModal, {
        modalDialogClass: 'modal-fullscreen-sm-down modal-box',
      });
      title = 'Fullscreen Below sm';
    } else if (value == 'below-md') {
      this.modal = this.modalService.open(SizeModal, {
        modalDialogClass: 'modal-fullscreen-md-down modal-box',
      });
      title = 'Fullscreen Below md';
    } else if (value == 'below-lg') {
      this.modal = this.modalService.open(SizeModal, {
        modalDialogClass: 'modal-fullscreen-lg-down modal-box',
      });
      title = 'Fullscreen Below lg';
    } else if (value == 'below-xl') {
      this.modal = this.modalService.open(SizeModal, {
        modalDialogClass: 'modal-fullscreen-xl-down modal-box',
      });
      title = 'Fullscreen Below xl';
    } else if (value == 'below-xxl') {
      this.modal = this.modalService.open(SizeModal, {
        modalDialogClass: 'modal-fullscreen-xxl-down modal-box',
      });
      title = 'Fullscreen Below xxl';
    }

    this.modal.componentInstance.title = title;
    this.modal.componentInstance.buttons = true;
  }
}
