import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';
import { products } from '../../../../../shared/data/dashboard/pos';
import { IOrderDetailsProduct } from '../../../../../shared/interface/order';
import { CartService } from '../../../../../shared/services/cart.service';

@Component({
  selector: 'app-product',
  imports: [FormsModule, FeatherIcon, DecimalPipe],
  templateUrl: './product.html',
  styleUrl: './product.scss',
})
export class Product {
  cartService = inject(CartService);

  public products = products;
  public filteredProduct: IOrderDetailsProduct[] = products;
  public searchQuery: string = '';
  public filter = {
    search: '',
  };

  updateQuantity(value: number, product: IOrderDetailsProduct) {
    if (value === 1 && product.quantity < product.total_quantity) {
      product.quantity += 1;
    } else if (value === -1 && product.quantity > 1) {
      product.quantity -= 1;
    }
  }

  addToCart(product: IOrderDetailsProduct) {
    const updatedProduct: IOrderDetailsProduct = {
      ...product,
      quantity: product.quantity,
    };
    this.cartService.posAddToCart(updatedProduct);
  }

  searchStores() {
    this.filter['search'] = this.searchQuery.toLowerCase();
    this.filterDetails();
  }

  filterDetails() {
    this.filteredProduct = this.products.filter((product) => {
      const matchesSearch = this.filter.search
        ? product.product_name.toLowerCase().includes(this.filter.search)
        : true;

      return matchesSearch;
    });
  }
}
