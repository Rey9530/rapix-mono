import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-increase-knowledge',
  imports: [RouterModule, Card],
  templateUrl: './increase-knowledge.html',
  styleUrl: './increase-knowledge.scss',
})
export class IncreaseKnowledge {}
