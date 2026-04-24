import { Component } from '@angular/core';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-analytics',
  imports: [NgbNavModule],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss',
})
export class Analytics {
  public active = 'facebook-pixel';
}
