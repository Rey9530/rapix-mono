import { Component } from '@angular/core';

import { NgScrollbarModule } from 'ngx-scrollbar';

import { Card } from '../../../../../shared/components/ui/card/card';
import { profileScrollbar } from '../../../../../shared/data/bonus-ui/scrollbar';

@Component({
  selector: 'app-profile-scrollbar',
  imports: [NgScrollbarModule, Card],
  templateUrl: './profile-scrollbar.html',
  styleUrl: './profile-scrollbar.scss',
})
export class ProfileScrollbar {
  public profileScrollbar = profileScrollbar;
}
