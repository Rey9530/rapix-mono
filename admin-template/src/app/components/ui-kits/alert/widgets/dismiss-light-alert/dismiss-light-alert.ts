import { Component } from '@angular/core';

import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';

@Component({
  selector: 'app-dismiss-light-alert',
  imports: [NgbAlertModule, Card, FeatherIcon],
  templateUrl: './dismiss-light-alert.html',
  styleUrl: './dismiss-light-alert.scss',
})
export class DismissLightAlert {}
