import { Component } from '@angular/core';

import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';
import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';

@Component({
  selector: 'app-custom-alert',
  imports: [NgbAlertModule, Card, SvgIcon],
  templateUrl: './custom-alert.html',
  styleUrl: './custom-alert.scss',
})
export class CustomAlert {}
