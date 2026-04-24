import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { list } from '../../../shared/data/bonus-ui/draggable-card';

@Component({
  selector: 'app-draggable-card',
  imports: [DragDropModule, NgClass],
  templateUrl: './draggable-card.html',
  styleUrl: './draggable-card.scss',
})
export class DraggableCard {
  public lists = list;
  public list = [...this.lists];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.list, event.previousIndex, event.currentIndex);
  }
}
