import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbModule, NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { Card } from '../../../../../shared/components/ui/card/card';
import { states } from '../../../../../shared/data/form-widgets';

@Component({
  selector: 'app-global-configuration-typeahead',
  imports: [FormsModule, NgbModule, Card],
  templateUrl: './global-configuration-typeahead.html',
  styleUrl: './global-configuration-typeahead.scss',
})
export class GlobalConfigurationTypeahead {
  public model: string;
  public states = states;

  constructor() {
    const config = inject(NgbTypeaheadConfig);

    config.showHint = true;
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2
          ? []
          : states
              .filter((v) =>
                v.toLowerCase().startsWith(term.toLocaleLowerCase()),
              )
              .splice(0, 10),
      ),
    );
}
