import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

import { Card } from '../../../../../shared/components/ui/card/card';
import { statesWithFlags } from '../../../../../shared/data/form-widgets';

@Component({
  selector: 'app-template-for-results',
  imports: [FormsModule, NgbModule, Card],
  templateUrl: './template-for-results.html',
  styleUrl: './template-for-results.scss',
})
export class TemplateForResults {
  public model: string;
  public statesWithFlags = statesWithFlags;

  search: OperatorFunction<string, readonly { name: string; flag: string }[]> =
    (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        map((term) =>
          term === ''
            ? []
            : statesWithFlags
                .filter(
                  (v) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1,
                )
                .slice(0, 10),
        ),
      );

  formatter = (x: { name: string }) => x.name;
}
