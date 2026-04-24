import { Component } from '@angular/core';

import { NgScrollbarModule } from 'ngx-scrollbar';

import { Card } from '../../../../../shared/components/ui/card/card';
import { scrollableImages } from '../../../../../shared/data/bonus-ui/scrollbar';

@Component({
  selector: 'app-horizontal-scrollbar',
  imports: [NgScrollbarModule, Card],
  templateUrl: './horizontal-scrollbar.html',
  styleUrl: './horizontal-scrollbar.scss',
})
export class HorizontalScrollbar {
  public scrollableImages = scrollableImages;
}
