import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { Card } from '../../../../../shared/components/ui/card/card';
import { states } from '../../../../../shared/data/form-widgets';

@Component({
  selector: 'app-simple-typeahead',
  imports: [FormsModule, NgbModule, Card],
  templateUrl: './simple-typeahead.html',
  styleUrl: './simple-typeahead.scss',
})
export class SimpleTypeahead {
  public model: string;
  public states = states;

  search: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>,
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2
          ? []
          : states
              .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10),
      ),
    );
}
