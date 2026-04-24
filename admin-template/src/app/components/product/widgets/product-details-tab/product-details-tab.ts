import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';

import {
  NgbModal,
  NgbNavModule,
  NgbRatingModule,
} from '@ng-bootstrap/ng-bootstrap';

import { ReviewModal } from '../../../../shared/components/ui/modal/review-modal/review-modal';
import { Table } from '../../../../shared/components/ui/table/table';
import { productDetails } from '../../../../shared/data/product';
import { IHasId, ITableConfigs } from '../../../../shared/interface/common';

@Component({
  selector: 'app-product-details-tab',
  imports: [NgbNavModule, NgbRatingModule, Table, NgClass],
  templateUrl: './product-details-tab.html',
  styleUrl: './product-details-tab.scss',
})
export class ProductDetailsTab {
  private modal = inject(NgbModal);

  public active = 1;
  public productDetails = productDetails;
  public rating: number[] = Array.from({ length: 5 }, (_, i) => i + 1);

  public tableConfig: ITableConfigs<IHasId> = {
    columns: [
      { title: 'Material', field_value: 'material' },
      { title: 'Colors', field_value: 'colors' },
      { title: 'Size Range', field_value: 'size_range' },
      { title: 'Fit', field_value: 'fit' },
      { title: 'NeckLine', field_value: 'neckline' },
      { title: 'Seam', field_value: 'seam' },
    ],
    data: productDetails.additional_info,
  };

  openReviewModal() {
    this.modal.open(ReviewModal, {
      centered: true,
      size: 'lg',
      windowClass: 'category-popup custom-input customer-review-modal',
    });
  }
}
