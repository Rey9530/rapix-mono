import { Component } from '@angular/core';

import { NgScrollbarModule } from 'ngx-scrollbar';

import { Card } from '../../../../../shared/components/ui/card/card';
import { scrollableContent } from '../../../../../shared/data/bonus-ui/scrollbar';

@Component({
  selector: 'app-scrollbar-content',
  imports: [NgScrollbarModule, Card],
  templateUrl: './scrollbar-content.html',
  styleUrl: './scrollbar-content.scss',
})
export class ScrollbarContent {
  public scrollableContent = scrollableContent;
}
