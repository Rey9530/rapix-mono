import { Component } from '@angular/core';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { Activation } from './widgets/activation/activation';
import { Analytics } from './widgets/analytics/analytics';
import { Delivery } from './widgets/delivery/delivery';
import { General } from './widgets/general/general';
import { PaymentMethod } from './widgets/payment-method/payment-method';
import { Refund } from './widgets/refund/refund';
import { SellerCommission } from './widgets/seller-commission/seller-commission';
import { WalletPoints } from './widgets/wallet-points/wallet-points';
import { Card } from '../../shared/components/ui/card/card';
import { SvgIcon } from '../../shared/components/ui/svg-icon/svg-icon';

@Component({
  selector: 'app-ecommerce-setting',
  imports: [
    NgbNavModule,
    Card,
    SvgIcon,
    General,
    Activation,
    WalletPoints,
    SellerCommission,
    Refund,
    Delivery,
    PaymentMethod,
    Analytics,
  ],
  templateUrl: './ecommerce-setting.html',
  styleUrl: './ecommerce-setting.scss',
})
export class EcommerceSetting {
  public active = 'general';
}
