import { Component } from '@angular/core';

import { NgScrollbarModule } from 'ngx-scrollbar';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-custom-scrollbar',
  imports: [NgScrollbarModule, Card],
  templateUrl: './custom-scrollbar.html',
  styleUrl: './custom-scrollbar.scss',
})
export class CustomScrollbar {}
