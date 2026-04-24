import { Component } from '@angular/core';

import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';
import { alertAdditionalContent } from '../../../../../shared/data/ui-kits/alert';

@Component({
  selector: 'app-additional-content',
  imports: [NgbAlertModule, Card],
  templateUrl: './additional-content.html',
  styleUrl: './additional-content.scss',
})
export class AdditionalContent {
  public alertAdditionalContent = alertAdditionalContent;
}
