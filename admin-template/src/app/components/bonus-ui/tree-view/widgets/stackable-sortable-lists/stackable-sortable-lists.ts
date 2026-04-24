import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { stackableSortableList } from '../../../../../shared/data/bonus-ui/tree-view';
import { ISwapList } from '../../../../../shared/interface/bonus-ui/bonus-ui';

@Component({
  selector: 'app-stackable-sortable-lists',
  imports: [DragDropModule, Card, NgClass, NgTemplateOutlet],
  templateUrl: './stackable-sortable-lists.html',
  styleUrl: './stackable-sortable-lists.scss',
})
export class StackableSortableLists {
  public stackableSortableList = stackableSortableList;

  public getAllDropLists(): string[] {
    return [];
  }

  public drop(event: CdkDragDrop<ISwapList[]>) {
    const prevContainer = event.previousContainer;
    const currContainer = event.container;

    if (prevContainer === currContainer) {
      moveItemInArray(
        currContainer.data,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      transferArrayItem(
        prevContainer.data,
        currContainer.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
