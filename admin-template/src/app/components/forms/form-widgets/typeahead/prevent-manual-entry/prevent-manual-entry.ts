import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs/operators';

import { Card } from '../../../../../shared/components/ui/card/card';
import { state } from '../../../../../shared/data/form-widgets';
import { IState } from '../../../../../shared/interface/form-widgets';

@Component({
  selector: 'app-prevent-manual-entry',
  imports: [FormsModule, NgbModule, Card],
  templateUrl: './prevent-manual-entry.html',
  styleUrl: './prevent-manual-entry.scss',
})
export class PreventManualEntry {
  public model: IState;
  public state = state;

  formatter = (state: IState) => state.name;

  search: OperatorFunction<string, readonly { id: number; name: string }[]> = (
    text$: Observable<string>,
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 2),
      map((term) =>
        state
          .filter((state) => new RegExp(term, 'mi').test(state.name))
          .slice(0, 10),
      ),
    );
}
