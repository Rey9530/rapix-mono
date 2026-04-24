import { SlicePipe } from '@angular/common';
import { Component } from '@angular/core';

import { Card } from '../../../../shared/components/ui/card/card';
import { menuItems } from '../../../../shared/data/menu';

@Component({
  selector: 'app-default-sitemap',
  imports: [Card, SlicePipe],
  templateUrl: './default-sitemap.html',
  styleUrl: './default-sitemap.scss',
})
export class DefaultSitemap {
  public menuItem = menuItems;
}
