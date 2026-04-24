import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { simpleList } from '../../../../../shared/data/bonus-ui/tree-view';

@Component({
  selector: 'app-simple-list',
  imports: [DragDropModule, Card],
  templateUrl: './simple-list.html',
  styleUrl: './simple-list.scss',
})
export class SimpleList {
  public simpleList = simpleList;

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
