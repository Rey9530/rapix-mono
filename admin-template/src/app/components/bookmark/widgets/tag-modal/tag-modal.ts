import { Component, TemplateRef, inject, viewChild } from '@angular/core';

import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tag-modal',
  imports: [],
  templateUrl: './tag-modal.html',
  styleUrl: './tag-modal.scss',
})
export class TagModal {
  private modalService = inject(NgbModal);

  readonly tagModal = viewChild<TemplateRef<string>>('tagModal');

  public closeResult: string;
  public modalOpen: boolean = false;

  async openModal() {
    this.modalOpen = true;
    this.modalService
      .open(this.tagModal(), {
        ariaLabelledBy: 'bookmark-Modal',
        windowClass: 'theme-modal modal-lg',
      })
      .result.then(
        (result) => {
          `Result ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        },
      );
  }

  private getDismissReason(reason: ModalDismissReasons): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  closeModal() {
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }

  ngOnDestroy() {
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }
}
