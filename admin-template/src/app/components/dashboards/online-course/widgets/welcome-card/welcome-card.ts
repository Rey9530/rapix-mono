import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-welcome-card',
  imports: [Card],
  templateUrl: './welcome-card.html',
  styleUrl: './welcome-card.scss',
})
export class WelcomeCard {}
