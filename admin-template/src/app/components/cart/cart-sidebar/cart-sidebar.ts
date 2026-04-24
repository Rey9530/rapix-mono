import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Card } from '../../../shared/components/ui/card/card';
import { CartService } from '../../../shared/services/cart.service';

@Component({
  selector: 'app-cart-sidebar',
  imports: [RouterModule, Card],
  templateUrl: './cart-sidebar.html',
  styleUrl: './cart-sidebar.scss',
})
export class CartSidebar {
  cartService = inject(CartService);
}
