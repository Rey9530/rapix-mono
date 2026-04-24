import { NgClass, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';

import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';
import { colorsTwo } from '../../../../../shared/data/ui-kits/helper-classes';

@Component({
  selector: 'app-link-dark-theme',
  imports: [NgbAlertModule, Card, NgClass, TitleCasePipe],
  templateUrl: './link-dark-theme.html',
  styleUrl: './link-dark-theme.scss',
})
export class LinkDarkTheme {
  public colors = colorsTwo;
}
