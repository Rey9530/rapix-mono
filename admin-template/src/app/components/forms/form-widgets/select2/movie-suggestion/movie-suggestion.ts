import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TagInputModule } from 'ngx-chips';

import { Card } from '../../../../../shared/components/ui/card/card';
import { movieSuggestion } from '../../../../../shared/data/form-widgets';

@Component({
  selector: 'app-movie-suggestion',
  imports: [TagInputModule, FormsModule, Card],
  templateUrl: './movie-suggestion.html',
  styleUrl: './movie-suggestion.scss',
})
export class MovieSuggestion {
  public movieSelect = ['Hot sit', 'The Matrix'];

  public movieSuggestion = movieSuggestion;
}
