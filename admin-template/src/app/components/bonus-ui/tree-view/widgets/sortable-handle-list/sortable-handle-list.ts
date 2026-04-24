import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { sortableList } from '../../../../../shared/data/bonus-ui/tree-view';
import { ISortableList } from '../../../../../shared/interface/bonus-ui/bonus-ui';

@Component({
  selector: 'app-sortable-handle-list',
  imports: [DragDropModule, Card],
  templateUrl: './sortable-handle-list.html',
  styleUrl: './sortable-handle-list.scss',
})
export class SortableHandleList {
  public sortableList = sortableList;

  drop(event: CdkDragDrop<ISortableList[]>) {
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
