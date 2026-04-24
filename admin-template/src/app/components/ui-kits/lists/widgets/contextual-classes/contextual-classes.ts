import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { contextualClassList } from '../../../../../shared/data/ui-kits/lists';

@Component({
  selector: 'app-contextual-classes',
  imports: [Card],
  templateUrl: './contextual-classes.html',
  styleUrl: './contextual-classes.scss',
})
export class ContextualClasses {
  public contextualClassList = contextualClassList;
}
