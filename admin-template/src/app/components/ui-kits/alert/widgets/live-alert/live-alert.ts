import { Component } from '@angular/core';

import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-live-alert',
  imports: [NgbAlertModule, Card],
  templateUrl: './live-alert.html',
  styleUrl: './live-alert.scss',
})
export class LiveAlert {
  public alerts = Array.from({ length: 0 }, (_, index) => index);

  addAlert() {
    this.alerts.push(this.alerts.length + 1);
  }

  close(i: number) {
    this.alerts.splice(this.alerts.indexOf(i), 1);
  }
}
