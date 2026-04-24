import { Component, inject } from '@angular/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../shared/components/ui/card/card';
import { SizeModal } from '../widgets/size-modal/size-modal';

@Component({
  selector: 'app-sizes-modals',
  imports: [Card],
  templateUrl: './sizes-modals.html',
  styleUrl: './sizes-modals.scss',
})
export class SizesModals {
  private modalService = inject(NgbModal);

  public modal: NgbModalRef;

  openModal(value: string) {
    let title = '';

    if (value == 'fullScreen') {
      this.modal = this.modalService.open(SizeModal, {
        fullscreen: true,
        modalDialogClass: 'modal-box',
      });
      title = 'Full Screen Modal';
    } else if (value == 'extraLarge') {
      this.modal = this.modalService.open(SizeModal, {
        size: 'xl',
        modalDialogClass: 'modal-box',
      });
      title = 'Extra Large Modal';
    } else if (value == 'large') {
      this.modal = this.modalService.open(SizeModal, {
        size: 'lg',
        modalDialogClass: 'modal-box',
      });
      title = 'Large Modal';
    } else if (value == 'small') {
      this.modal = this.modalService.open(SizeModal, {
        size: 'sm',
        modalDialogClass: 'modal-box',
      });
      title = 'Small Modal';
    }

    this.modal.componentInstance.title = title;
  }
}
