import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import {
  sharedList,
  sharedList2,
} from '../../../../../shared/data/bonus-ui/tree-view';

@Component({
  selector: 'app-shared-list',
  imports: [DragDropModule, Card],
  templateUrl: './shared-list.html',
  styleUrl: './shared-list.scss',
})
export class SharedList {
  public sharedList = sharedList;
  public sharedList2 = sharedList2;

  drop(event: CdkDragDrop<string[]>) {
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
