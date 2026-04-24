import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-welcome-card',
  imports: [RouterModule, Card, DecimalPipe],
  templateUrl: './welcome-card.html',
  styleUrl: './welcome-card.scss',
})
export class WelcomeCard {}
