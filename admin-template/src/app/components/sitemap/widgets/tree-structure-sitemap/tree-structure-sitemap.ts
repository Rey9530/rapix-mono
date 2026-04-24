import { NgTemplateOutlet, SlicePipe } from '@angular/common';
import { Component } from '@angular/core';

import { Card } from '../../../../shared/components/ui/card/card';
import { menuItems } from '../../../../shared/data/menu';

@Component({
  selector: 'app-tree-structure-sitemap',
  imports: [Card, NgTemplateOutlet, SlicePipe],
  templateUrl: './tree-structure-sitemap.html',
  styleUrl: './tree-structure-sitemap.scss',
})
export class TreeStructureSitemap {
  public menuItem = menuItems;
}
