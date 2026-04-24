import { LowerCasePipe } from '@angular/common';
import { Component } from '@angular/core';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../shared/components/ui/card/card';
import { flatButton } from '../../../../shared/data/buttons';

@Component({
  selector: 'app-defaults-buttons',
  imports: [Card, NgbTooltipModule, LowerCasePipe],
  templateUrl: './defaults-buttons.html',
  styleUrl: './defaults-buttons.scss',
})
export class DefaultsButtons {
  public defaultButton = flatButton;
}
