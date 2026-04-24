import { Component, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CreateStoreModal } from './create-store-modal/create-store-modal';
import { FeatherIcon } from '../../shared/components/ui/feather-icon/feather-icon';
import { StoreCategories, stores } from '../../shared/data/store';
import { IStore } from '../../shared/interface/store';

@Component({
  selector: 'app-seller',
  imports: [FormsModule, RouterLink, CreateStoreModal, FeatherIcon],
  templateUrl: './seller.html',
  styleUrl: './seller.scss',
})
export class Seller {
  readonly CreateStoreModal = viewChild<CreateStoreModal>('createStoreModal');

  public storesCategory = StoreCategories;
  public stores: IStore[] = stores;
  public activeCategory?: number;
  public searchQuery: string = '';
  public filteredStores: IStore[] = stores;
  public filter: { search: string; store_category_id: number | undefined } = {
    search: '',
    store_category_id: undefined,
  };

  filterStore(id?: number) {
    this.filter['store_category_id'] = id;
    this.activeCategory = id;
    this.filterDetails();
  }

  searchStores() {
    this.filter['search'] = this.searchQuery.toLowerCase();
    this.filterDetails();
  }

  filterDetails() {
    this.filteredStores = this.stores.filter((store) => {
      const matchesCategory = this.filter.store_category_id
        ? store.store_category_id === this.filter.store_category_id
        : true;
      const matchesSearch = this.filter.search
        ? store.store_name.toLowerCase().includes(this.filter.search)
        : true;

      return matchesCategory && matchesSearch;
    });
  }
}
