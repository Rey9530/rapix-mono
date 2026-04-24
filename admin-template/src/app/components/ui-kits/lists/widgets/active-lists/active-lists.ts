import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { activeLists } from '../../../../../shared/data/ui-kits/lists';

@Component({
  selector: 'app-active-lists',
  imports: [Card, NgClass],
  templateUrl: './active-lists.html',
  styleUrl: './active-lists.scss',
})
export class ActiveLists {
  public activeLists = activeLists;
}
