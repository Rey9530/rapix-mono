import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TagInputModule } from 'ngx-chips';

import { Card } from '../../../../../shared/components/ui/card/card';
import { randomSuggestion } from '../../../../../shared/data/form-widgets';

@Component({
  selector: 'app-random-suggestion',
  imports: [TagInputModule, FormsModule, Card],
  templateUrl: './random-suggestion.html',
  styleUrl: './random-suggestion.scss',
})
export class RandomSuggestion {
  public randomList = ['tivo', 'roxo', 'sheltos', 'viho'];
  public randomSuggestion = randomSuggestion;
}
