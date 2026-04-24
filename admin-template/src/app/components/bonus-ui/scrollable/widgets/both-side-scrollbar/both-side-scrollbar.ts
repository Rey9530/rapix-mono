import { Component } from '@angular/core';

import { NgScrollbarModule } from 'ngx-scrollbar';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-both-side-scrollbar',
  imports: [NgScrollbarModule, Card],
  templateUrl: './both-side-scrollbar.html',
  styleUrl: './both-side-scrollbar.scss',
})
export class BothSideScrollbar {}
