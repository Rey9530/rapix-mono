import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';
import { modalContent } from '../../../../../shared/data/ui-kits/modal';

@Component({
  selector: 'app-scrolling-content-modal',
  imports: [FeatherIcon, NgClass],
  templateUrl: './scrolling-content-modal.html',
  styleUrl: './scrolling-content-modal.scss',
})
export class ScrollingContentModal {
  private modal = inject(NgbActiveModal);

  public modalContent = modalContent;

  closeModal() {
    this.modal.close();
  }
}
