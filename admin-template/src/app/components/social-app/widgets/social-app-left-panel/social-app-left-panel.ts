import { Component } from '@angular/core';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { friends } from '../../../../shared/data/social-app';
import { MyProfile } from '../my-profile/my-profile';

@Component({
  selector: 'app-social-app-left-panel',
  imports: [NgbAccordionModule, MyProfile],
  templateUrl: './social-app-left-panel.html',
  styleUrl: './social-app-left-panel.scss',
})
export class SocialAppLeftPanel {
  public friends = friends;
}
