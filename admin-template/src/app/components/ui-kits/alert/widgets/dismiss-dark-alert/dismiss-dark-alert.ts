import { Component } from '@angular/core';

import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';

@Component({
  selector: 'app-dismiss-dark-alert',
  imports: [NgbAlertModule, Card, FeatherIcon],
  templateUrl: './dismiss-dark-alert.html',
  styleUrl: './dismiss-dark-alert.scss',
})
export class DismissDarkAlert {}
