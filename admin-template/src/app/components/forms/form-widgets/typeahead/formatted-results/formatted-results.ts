import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { Card } from '../../../../../shared/components/ui/card/card';
import { states } from '../../../../../shared/data/form-widgets';

@Component({
  selector: 'app-formatted-results',
  imports: [FormsModule, NgbModule, Card],
  templateUrl: './formatted-results.html',
  styleUrl: './formatted-results.scss',
})
export class FormattedResults {
  public model: string;
  public states = states;

  formatter = (result: string) => result.toUpperCase();

  search: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>,
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term === ''
          ? []
          : states
              .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10),
      ),
    );
}
