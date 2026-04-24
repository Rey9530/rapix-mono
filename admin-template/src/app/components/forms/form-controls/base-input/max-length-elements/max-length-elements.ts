import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-max-length-elements',
  imports: [FormsModule, Card],
  templateUrl: './max-length-elements.html',
  styleUrl: './max-length-elements.scss',
})
export class MaxLengthElements {
  public basicMaxLength = 10;
  public basicText = '';
  public basicLengthVisible: boolean = false;

  public thresholdLength = 20;
  public thresholdText = '';
  public thresholdValueVisible: boolean = false;

  public showBadgeLength = 15;
  public showBadgeText = '';
  public showBadgeLengthVisible: boolean = false;
  public showBadge: boolean = true;

  public customizedTextLength = 30;
  public customizedText = '';
  public customizedTextVisible: boolean = false;

  public textAreaLength = 25;
  public textAreaText = '';
  public textAreaTextVisible: boolean = false;

  public topLeftLength = 15;
  public topLeftText = '';
  public topLeftBadgeVisible: boolean = false;

  public topRightLength = 15;
  public topRightText = '';
  public topRightBadgeVisible: boolean = false;

  public BottomRightLength = 15;
  public BottomRightText = '';
  public BottomRightBadgeVisible: boolean = false;

  public BottomLeftLength = 15;
  public BottomLeftText = '';
  public BottomLeftBadgeVisible: boolean = false;
}
