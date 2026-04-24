import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-social-media-announcement',
  imports: [RouterModule, Card],
  templateUrl: './social-media-announcement.html',
  styleUrl: './social-media-announcement.scss',
})
export class SocialMediaAnnouncement {}
