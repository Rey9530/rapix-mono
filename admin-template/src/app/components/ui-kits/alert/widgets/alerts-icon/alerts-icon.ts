import { Component } from '@angular/core';

import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-alerts-icon',
  imports: [NgbAlertModule, Card],
  templateUrl: './alerts-icon.html',
  styleUrl: './alerts-icon.scss',
})
export class AlertsIcon {
  public showWarningAlert = true;
  public showDangerAlert = true;
  public isCheckButtonClicked = false;
  public isAlertButtonClicked = false;

  onCloseWarningAlert() {
    this.showWarningAlert = false;
  }

  onCloseDangerAlert() {
    this.showDangerAlert = false;
  }

  onCheckButtonClicked() {
    this.isCheckButtonClicked = true;
    this.onCloseWarningAlert();
  }

  onAlertButtonClicked() {
    this.isAlertButtonClicked = true;
    this.onCloseDangerAlert();
  }
}
