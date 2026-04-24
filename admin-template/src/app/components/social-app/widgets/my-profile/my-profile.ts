import { Component } from '@angular/core';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { myProfile } from '../../../../shared/data/social-app';

@Component({
  selector: 'app-my-profile',
  imports: [NgbTooltipModule],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.scss',
})
export class MyProfile {
  public myProfile = myProfile;
}
