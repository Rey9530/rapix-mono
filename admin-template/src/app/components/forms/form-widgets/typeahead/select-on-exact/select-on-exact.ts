import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

import { Card } from '../../../../../shared/components/ui/card/card';
import { state } from '../../../../../shared/data/form-widgets';

@Component({
  selector: 'app-select-on-exact',
  imports: [FormsModule, NgbModule, Card],
  templateUrl: './select-on-exact.html',
  styleUrl: './select-on-exact.scss',
})
export class SelectOnExact {
  public model: string;
  public states = state;

  search: OperatorFunction<string, readonly { name: string }[]> = (
    text$: Observable<string>,
  ) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term === ''
          ? []
          : state
              .filter(
                (v) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1,
              )
              .slice(0, 10),
      ),
    );

  formatter = (x: { name: string }) => x.name;
}
