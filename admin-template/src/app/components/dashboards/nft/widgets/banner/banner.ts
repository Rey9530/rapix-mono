import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-banner',
  imports: [RouterModule, Card],
  templateUrl: './banner.html',
  styleUrl: './banner.scss',
})
export class Banner {}
