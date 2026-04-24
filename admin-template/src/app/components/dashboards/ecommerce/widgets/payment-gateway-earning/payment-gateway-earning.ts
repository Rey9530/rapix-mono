import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { earnings } from '../../../../../shared/data/dashboard/e-commerce';

@Component({
  selector: 'app-payment-gateway-earning',
  imports: [Card, SvgIcon],
  templateUrl: './payment-gateway-earning.html',
  styleUrl: './payment-gateway-earning.scss',
})
export class PaymentGatewayEarning {
  public cardToggleOption = cardToggleOptions3;
  public earnings = earnings;
}
