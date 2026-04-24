import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { disableList } from '../../../../../shared/data/bonus-ui/tree-view';

@Component({
  selector: 'app-disable-list',
  imports: [DragDropModule, Card],
  templateUrl: './disable-list.html',
  styleUrl: './disable-list.scss',
})
export class DisableList {
  public disableList = disableList;

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
