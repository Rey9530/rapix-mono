import { NgClass } from '@angular/common';
import { Component, TemplateRef, inject, viewChild } from '@angular/core';

import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CompanyInfo } from './widgets/company-info/company-info';
import { CompanyOverview } from './widgets/company-overview/company-overview';
import { FinancialInfo } from './widgets/financial-info/financial-info';
import { Finish } from './widgets/finish/finish';
import { PersonalInfo } from './widgets/personal-info/personal-info';
import { addSeller } from '../../../shared/data/seller';

@Component({
  selector: 'app-create-store-modal',
  imports: [
    PersonalInfo,
    CompanyInfo,
    CompanyOverview,
    FinancialInfo,
    Finish,
    NgClass,
  ],
  templateUrl: './create-store-modal.html',
  styleUrl: './create-store-modal.scss',
})
export class CreateStoreModal {
  private modalService = inject(NgbModal);

  readonly CreateStoreModal =
    viewChild<TemplateRef<string>>('createStoreModal');

  public addSeller = addSeller;
  public activeTab: number = 1;
  public closeResult: string;
  public modalOpen: boolean = false;

  async openModal() {
    this.modalOpen = true;
    this.modalService
      .open(this.CreateStoreModal(), {
        ariaLabelledBy: 'store-Modal',
        centered: true,
        size: 'xl',
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

  handleStep(value: number) {
    if (value == -1) {
      this.activeTab = this.activeTab - 1;
    } else if (value == 1 && this.activeTab < this.addSeller.length) {
      this.activeTab = this.activeTab + 1;
    }
  }

  ngOnDestroy() {
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }
}
