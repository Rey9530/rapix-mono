import { Component } from '@angular/core';

import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';

@Component({
  selector: 'app-outline-dark-light-alert',
  imports: [NgbAlertModule, Card, FeatherIcon],
  templateUrl: './outline-dark-light-alert.html',
  styleUrl: './outline-dark-light-alert.scss',
})
export class OutlineDarkLightAlert {}
