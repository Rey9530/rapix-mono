import { Component } from '@angular/core';

import { NgScrollbarModule } from 'ngx-scrollbar';

import { Card } from '../../../../../shared/components/ui/card/card';
import { badgeScrollbar } from '../../../../../shared/data/bonus-ui/scrollbar';

@Component({
  selector: 'app-badge-scrollbar',
  imports: [NgScrollbarModule, Card],
  templateUrl: './badge-scrollbar.html',
  styleUrl: './badge-scrollbar.scss',
})
export class BadgeScrollbar {
  public badgeScrollbar = badgeScrollbar;
}
