import { NgClass, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';

import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';
import { colorsTwo } from '../../../../../shared/data/ui-kits/helper-classes';

@Component({
  selector: 'app-link-light-theme',
  imports: [NgbAlertModule, Card, NgClass, TitleCasePipe],
  templateUrl: './link-light-theme.html',
  styleUrl: './link-light-theme.scss',
})
export class LinkLightTheme {
  public colors = colorsTwo;
}
