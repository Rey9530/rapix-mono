import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-basic-card',
  imports: [Card],
  templateUrl: './basic-card.html',
  styleUrl: './basic-card.scss',
})
export class BasicCard {}
