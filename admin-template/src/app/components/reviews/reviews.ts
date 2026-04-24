import { Component } from '@angular/core';

import {
  Select2Module,
  Select2UpdateEvent,
  Select2UpdateValue,
} from 'ng-select2-component';

import { Card } from '../../shared/components/ui/card/card';
import { Table } from '../../shared/components/ui/table/table';
import { rating, reviews, reviewStatus } from '../../shared/data/review';
import {
  ITableClickedAction,
  ITableConfigs,
} from '../../shared/interface/common';
import { IReview } from '../../shared/interface/review';

@Component({
  selector: 'app-reviews',
  imports: [Select2Module, Card, Table],
  templateUrl: './reviews.html',
  styleUrl: './reviews.scss',
})
export class Reviews {
  public rating = rating;
  public reviewStatus = reviewStatus;
  public reviews: IReview[];
  public filter: { rating: number | null; status: string } = {
    rating: null,
    status: '',
  };

  public tableConfig: ITableConfigs<IReview> = {
    columns: [
      { title: 'Product', field_value: 'product_name', sort: true },
      { title: 'Reviewer', field_value: 'reviewer_name', sort: true },
      { title: 'Review', field_value: 'review', sort: true },
      { title: 'Date', field_value: 'date', sort: true },
      { title: 'Status', field_value: 'status', sort: true },
    ],
    row_action: [
      {
        label: 'Delete',
        action_to_perform: 'delete',
        icon: 'trash1',
        modal: true,
        model_text: 'Do you really want to delete the review?',
      },
    ],
    data: [] as IReview[],
  };

  ngOnInit() {
    this.tableConfig.data = this.formatReview(reviews);
    this.reviews = reviews;
  }

  handleAction(value: ITableClickedAction<IReview>) {
    if (value.action_to_perform === 'delete' && value.data) {
      this.reviews = this.reviews.filter(
        (review: IReview) => review.id !== value.data!.id,
      );
      this.tableConfig = {
        ...this.tableConfig,
        data: this.formatReview(this.reviews),
      };
    }
  }

  handleUpdate(value: Select2UpdateEvent<Select2UpdateValue>, field: string) {
    if (field == 'rating') {
      this.filter[field] = value ? Number(value.value) : null;
    } else if (field == 'status') {
      this.filter.status = value ? String(value.value) : '';
    }
    this.tableConfig = {
      ...this.tableConfig,
      data: this.formatReview(this.filterDetails()),
    };
  }

  filterDetails() {
    return this.reviews.filter((review) => {
      const matchesRating = this.filter.rating
        ? review.rating === this.filter.rating
        : true;
      const matchesStatus = this.filter.status
        ? review.status === this.filter.status
        : true;

      return matchesRating && matchesStatus;
    });
  }

  private formatReview(reviews: IReview[]) {
    return reviews.map((review: IReview) => {
      const formattedReview = { ...review };
      formattedReview.product_name = `<div class="product-names">
                                      <div class="light-product-box">
                                      <img class="img-fluid" src="${review.product_image}" alt="${review.product_name}"></div>
                                      <p>${review.product_name}</p>
                                    </div>`;

      formattedReview.reviewer_name = `<div class="common-f-start">
                                        <img class="img-fluid" src="${review.reviewer_profile}" alt="${review.reviewer_name}">
                                        <div class="user-details">
                                          <a href="javascript:void(0)">${review.reviewer_name}</a>
                                          <p class="mb-0">${review.reviewer_email}</p>
                                        </div>
                                      </div>`;

      const totalStars = 5;
      let starsHtml = '';
      for (let i = 0; i < review.rating; i++) {
        starsHtml += '<i class="fa-solid fa-star txt-warning"></i>';
      }

      for (let i = review.rating; i < totalStars; i++) {
        starsHtml += '<i class="fa-regular fa-star txt-warning"></i>';
      }

      formattedReview.review = `<div class="rating">
                                  ${starsHtml}
                                </div>
                                <div class="customer-review">
                                  <span>
                                    ${review.review}
                                  </span>
                                </div>`;
      formattedReview.status =
        review.status === 'Approve'
          ? `<span class="badge badge-light-success">${review.status}</span>`
          : review.status === 'Reject'
            ? `<span class="badge badge-light-danger">${review.status}</span>`
            : '-';

      return formattedReview;
    });
  }
}
