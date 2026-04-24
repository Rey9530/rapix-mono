import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { sellerDetails, stores } from '../../../../../shared/data/store';
import { IStore } from '../../../../../shared/interface/store';

@Component({
  selector: 'app-seller-details',
  imports: [],
  templateUrl: './seller-details.html',
  styleUrl: './seller-details.scss',
})
export class SellerDetails {
  private route = inject(ActivatedRoute);

  public storeId: number;
  public currentStore: IStore;
  public details = sellerDetails.details;
  public stores = stores;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      if (!isNaN(id)) {
        this.storeId = id;
        const store = this.stores.find((store) => store.id === this.storeId);
        if (store) {
          this.currentStore = store;
        }
      }
    });
  }
}
