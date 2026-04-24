import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { draggableList } from '../../../../../shared/data/bonus-ui/tree-view';
import { IDraggableList } from '../../../../../shared/interface/bonus-ui/bonus-ui';

@Component({
  selector: 'app-draggable-filtering',
  imports: [DragDropModule, Card],
  templateUrl: './draggable-filtering.html',
  styleUrl: './draggable-filtering.scss',
})
export class DraggableFiltering {
  public draggableList = draggableList;

  drop(event: CdkDragDrop<IDraggableList[]>) {
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
