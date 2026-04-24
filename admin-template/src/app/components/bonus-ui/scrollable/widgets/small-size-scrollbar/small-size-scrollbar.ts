import { Component } from '@angular/core';

import { NgScrollbarModule } from 'ngx-scrollbar';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-small-size-scrollbar',
  imports: [NgScrollbarModule, Card],
  templateUrl: './small-size-scrollbar.html',
  styleUrl: './small-size-scrollbar.scss',
})
export class SmallSizeScrollbar {}
