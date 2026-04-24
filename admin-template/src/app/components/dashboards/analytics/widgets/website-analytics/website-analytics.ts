import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-website-analytics',
  imports: [RouterModule, Card],
  templateUrl: './website-analytics.html',
  styleUrl: './website-analytics.scss',
})
export class WebsiteAnalytics {}
