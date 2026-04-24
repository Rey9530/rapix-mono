import { Component } from '@angular/core';

import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';

@Component({
  selector: 'app-left-border-alert',
  imports: [NgbAlertModule, Card, FeatherIcon],
  templateUrl: './left-border-alert.html',
  styleUrl: './left-border-alert.scss',
})
export class LeftBorderAlert {}
