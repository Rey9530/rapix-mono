import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Card } from '../../shared/components/ui/card/card';
import { WishlistService } from '../../shared/services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  imports: [RouterModule, Card, DecimalPipe],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss',
})
export class Wishlist {
  wishlistService = inject(WishlistService);
}
