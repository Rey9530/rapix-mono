import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';
import { topCustomers } from '../../../../../shared/data/dashboard/e-commerce';

@Component({
  selector: 'app-top-customers',
  imports: [RouterModule, Card],
  templateUrl: './top-customers.html',
  styleUrl: './top-customers.scss',
})
export class TopCustomers {
  public topCustomers = topCustomers;
}
