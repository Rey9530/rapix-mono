import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { swapList } from '../../../../../shared/data/bonus-ui/tree-view';
import { ISwapList } from '../../../../../shared/interface/bonus-ui/bonus-ui';

@Component({
  selector: 'app-sortable-swap-list',
  imports: [DragDropModule, Card],
  templateUrl: './sortable-swap-list.html',
  styleUrl: './sortable-swap-list.scss',
})
export class SortableSwapList {
  public swapList = swapList;

  drop(event: CdkDragDrop<ISwapList[]>, items: ISwapList[]) {
    if (event.previousContainer === event.container) {
      moveItemInArray(items, event.previousIndex, event.currentIndex);
    }
  }
}
