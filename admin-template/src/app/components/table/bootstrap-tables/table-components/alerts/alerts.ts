import { Component } from '@angular/core';

import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-alerts',
  imports: [Card, NgbAlertModule],
  templateUrl: './alerts.html',
  styleUrl: './alerts.scss',
})
export class Alerts {}
