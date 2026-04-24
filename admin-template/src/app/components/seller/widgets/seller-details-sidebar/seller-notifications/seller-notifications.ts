import { Component } from '@angular/core';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { sellerDetails } from '../../../../../shared/data/store';

@Component({
  selector: 'app-seller-notifications',
  imports: [NgbTooltipModule],
  templateUrl: './seller-notifications.html',
  styleUrl: './seller-notifications.scss',
})
export class SellerNotifications {
  public notifications = sellerDetails.notifications;
}
