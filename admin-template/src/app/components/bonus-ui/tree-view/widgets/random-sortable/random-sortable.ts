import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { randomSortable } from '../../../../../shared/data/bonus-ui/tree-view';
import { IRandomSortable } from '../../../../../shared/interface/bonus-ui/bonus-ui';

@Component({
  selector: 'app-random-sortable',
  imports: [DragDropModule, Card],
  templateUrl: './random-sortable.html',
  styleUrl: './random-sortable.scss',
})
export class RandomSortable {
  public randomSortable = randomSortable;

  drop(event: CdkDragDrop<IRandomSortable[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
