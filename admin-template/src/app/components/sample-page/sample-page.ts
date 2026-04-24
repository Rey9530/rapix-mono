import { Component } from '@angular/core';

import { Card } from '../../shared/components/ui/card/card';

@Component({
  selector: 'app-sample-page',
  imports: [Card],
  templateUrl: './sample-page.html',
  styleUrl: './sample-page.scss',
})
export class SamplePage {}
