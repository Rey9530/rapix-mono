import { Component, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../shared/components/ui/card/card';
import { CubaSignupModal } from '../widgets/cuba-signup-modal/cuba-signup-modal';
import { ScrollingContentModal } from '../widgets/scrolling-content-modal/scrolling-content-modal';
import { SimpleModal } from '../widgets/simple-modal/simple-modal';
import { TooltipPopoverModal } from '../widgets/tooltip-popover-modal/tooltip-popover-modal';

@Component({
  selector: 'app-basic-modals',
  imports: [Card],
  templateUrl: './basic-modals.html',
  styleUrl: './basic-modals.scss',
})
export class BasicModals {
  private modal = inject(NgbModal);

  openSimpleModal() {
    this.modal.open(SimpleModal);
  }

  openScrollingModal() {
    this.modal.open(ScrollingContentModal, { modalDialogClass: 'modal-box' });
  }

  openTooltipPopoverModal() {
    this.modal.open(TooltipPopoverModal, {
      centered: true,
      modalDialogClass: 'modal-box',
    });
  }

  openCubaModal() {
    this.modal.open(CubaSignupModal, { modalDialogClass: 'modal-box' });
  }
}
