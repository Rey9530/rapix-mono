import { Injectable } from '@angular/core';

import { wishlistItems } from '../data/wishlist';
import { IWishlistItem } from '../interface/wishlist';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  public wishlistItems: IWishlistItem[];

  constructor() {
    const items = localStorage.getItem('wishlist');
    if (
      items &&
      items !== 'null' &&
      items !== '' &&
      JSON.parse(items).length > 0
    ) {
      this.wishlistItems = JSON.parse(items);
    } else {
      this.wishlistItems = wishlistItems;
      localStorage.setItem('wishlist', JSON.stringify(this.wishlistItems));
    }
  }

  removeItem(item: IWishlistItem) {
    this.wishlistItems = this.wishlistItems.filter(
      (items) => items.id !== item.id,
    );
    localStorage.setItem('wishlist', JSON.stringify(this.wishlistItems));
  }
}
