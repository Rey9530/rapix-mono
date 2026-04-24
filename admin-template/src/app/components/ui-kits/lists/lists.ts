import { Component } from '@angular/core';

import { ActiveLists } from './widgets/active-lists/active-lists';
import { ContextualClasses } from './widgets/contextual-classes/contextual-classes';
import { CustomContentList } from './widgets/custom-content-list/custom-content-list';
import { DefaultLists } from './widgets/default-lists/default-lists';
import { DisabledList } from './widgets/disabled-list/disabled-list';
import { FlushLists } from './widgets/flush-lists/flush-lists';
import { HorizontalList } from './widgets/horizontal-list/horizontal-list';
import { JavascriptBehavior } from './widgets/javascript-behavior/javascript-behavior';
import { ListCheckbox } from './widgets/list-checkbox/list-checkbox';
import { ListNumber } from './widgets/list-number/list-number';
import { ListRadio } from './widgets/list-radio/list-radio';
import { NumberBadgeList } from './widgets/number-badge-list/number-badge-list';
import { ScrollableList } from './widgets/scrollable-list/scrollable-list';

@Component({
  selector: 'app-lists',
  imports: [
    DefaultLists,
    ActiveLists,
    FlushLists,
    ContextualClasses,
    HorizontalList,
    CustomContentList,
    ListCheckbox,
    ListRadio,
    ListNumber,
    JavascriptBehavior,
    NumberBadgeList,
    DisabledList,
    ScrollableList,
  ],
  templateUrl: './lists.html',
  styleUrl: './lists.scss',
})
export class Lists {}
