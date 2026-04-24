import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TagInputModule } from 'ngx-chips';

import { Card } from '../../../../../shared/components/ui/card/card';
import { randomSuggestion } from '../../../../../shared/data/form-widgets';

@Component({
  selector: 'app-render-suggestion',
  imports: [TagInputModule, FormsModule, Card],
  templateUrl: './render-suggestion.html',
  styleUrl: './render-suggestion.scss',
})
export class RenderSuggestion {
  public suggestion = [];
  public renderSuggestion = randomSuggestion;
}
