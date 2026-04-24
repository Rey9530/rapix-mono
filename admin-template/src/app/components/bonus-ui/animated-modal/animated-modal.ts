import { Component, TemplateRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Select2Module } from 'ng-select2-component';

import { Card } from '../../../shared/components/ui/card/card';
import {
  modalInValues,
  modalOutValues,
} from '../../../shared/data/bonus-ui/animated-modal';

@Component({
  selector: 'app-animated-modal',
  imports: [FormsModule, Select2Module, Card],
  templateUrl: './animated-modal.html',
  styleUrl: './animated-modal.scss',
})
export class AnimatedModal {
  private modal = inject(NgbModal);

  public modalInValues = modalInValues;
  public modalOutValues = modalOutValues;
  public modalInSelectedValue = 'bounceIn';
  public modalOutSelectedValue = 'flipOutX';
  public toastVisible: boolean = false;

  private modalRef: NgbModalRef | null = null;

  openModal(value: TemplateRef<string>) {
    this.modalRef = this.modal.open(value, {
      modalDialogClass: 'animated ' + this.modalInSelectedValue,
      windowClass: 'modal-popup animated-popup',
    });
  }

  closeModal() {
    if (this.modalRef) {
      const modalDialog = document.querySelector('.modal-dialog');
      if (modalDialog) {
        modalDialog.classList.remove(this.modalInSelectedValue);
        modalDialog.classList.add(this.modalOutSelectedValue);

        this.modalRef?.close();
      }
    }

    this.toastVisible = true;
    setTimeout(() => {
      this.toastVisible = false;
    }, 5000);
  }
}
