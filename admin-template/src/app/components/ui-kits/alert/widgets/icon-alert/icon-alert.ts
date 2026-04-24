import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';
import { iconsAlert } from '../../../../../shared/data/ui-kits/alert';

@Component({
  selector: 'app-icon-alert',
  imports: [NgbAlertModule, Card, FeatherIcon, NgClass],
  templateUrl: './icon-alert.html',
  styleUrl: './icon-alert.scss',
})
export class IconAlert {
  public iconsAlert = iconsAlert;
}
