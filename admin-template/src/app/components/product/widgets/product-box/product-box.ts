import { DecimalPipe, NgClass } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { NgbModal, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import { ProductDetailsModal } from '../../../../shared/components/ui/modal/product-details-modal/product-details-modal';
import { IProduct } from '../../../../shared/interface/product';

@Component({
  selector: 'app-product-box',
  imports: [RouterModule, NgbRatingModule, DecimalPipe, NgClass],
  templateUrl: './product-box.html',
  styleUrl: './product-box.scss',
})
export class ProductBox {
  private modal = inject(NgbModal);

  readonly product = input<IProduct>();

  openModal(product: IProduct) {
    const modalRef = this.modal.open(ProductDetailsModal, {
      centered: true,
      size: 'lg',
      windowClass: 'product-modal',
    });
    modalRef.componentInstance.productDetail = product;
  }

  public rating: number = 0;

  ngOnInit() {
    const product = this.product();
    if (product) {
      this.rating = Number(product.rating) ?? 0;
    }
  }

  getNumericValue(value: SafeHtml) {
    return Number(value);
  }
}
