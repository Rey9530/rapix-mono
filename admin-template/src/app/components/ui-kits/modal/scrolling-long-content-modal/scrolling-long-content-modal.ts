import { NgClass } from '@angular/common';
import { Component, TemplateRef, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../shared/components/ui/feather-icon/feather-icon';
import { modalContent } from '../../../../shared/data/ui-kits/modal';

@Component({
  selector: 'app-scrolling-long-content-modal',
  imports: [Card, FeatherIcon, NgClass],
  templateUrl: './scrolling-long-content-modal.html',
  styleUrl: './scrolling-long-content-modal.scss',
})
export class ScrollingLongContentModal {
  private modal = inject(NgbModal);

  public modalContent = modalContent;

  openModal(value: TemplateRef<NgbModal>) {
    this.modal.open(value, {
      centered: true,
      scrollable: true,
      modalDialogClass: 'modal-box',
    });
  }

  closeModal() {
    this.modal.dismissAll();
  }
}
