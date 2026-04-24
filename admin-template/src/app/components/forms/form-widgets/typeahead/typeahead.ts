import { Component } from '@angular/core';

import { FormattedResults } from './formatted-results/formatted-results';
import { GlobalConfigurationTypeahead } from './global-configuration-typeahead/global-configuration-typeahead';
import { OpenOnFocus } from './open-on-focus/open-on-focus';
import { PreventManualEntry } from './prevent-manual-entry/prevent-manual-entry';
import { SelectOnExact } from './select-on-exact/select-on-exact';
import { SimpleTypeahead } from './simple-typeahead/simple-typeahead';
import { TemplateForResults } from './template-for-results/template-for-results';
import { WikipediaSearch } from './wikipedia-search/wikipedia-search';

@Component({
  selector: 'app-typeahead',
  imports: [
    FormattedResults,
    GlobalConfigurationTypeahead,
    OpenOnFocus,
    PreventManualEntry,
    SelectOnExact,
    SimpleTypeahead,
    TemplateForResults,
    WikipediaSearch,
  ],
  templateUrl: './typeahead.html',
  styleUrl: './typeahead.scss',
})
export class Typeahead {}
