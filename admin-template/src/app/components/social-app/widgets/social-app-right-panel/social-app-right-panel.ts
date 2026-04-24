import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import {
  NgbAccordionModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';

import { friends, myProfile } from '../../../../shared/data/social-app';

@Component({
  selector: 'app-social-app-right-panel',
  imports: [NgbAccordionModule, NgbTooltipModule, NgClass],
  templateUrl: './social-app-right-panel.html',
  styleUrl: './social-app-right-panel.scss',
})
export class SocialAppRightPanel {
  public myProfile = myProfile;
  public friends = friends;
}
