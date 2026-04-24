import { Component } from '@angular/core';

import { DisableList } from './widgets/disable-list/disable-list';
import { DraggableFiltering } from './widgets/draggable-filtering/draggable-filtering';
import { RandomSortable } from './widgets/random-sortable/random-sortable';
import { SharedList } from './widgets/shared-list/shared-list';
import { SimpleList } from './widgets/simple-list/simple-list';
import { SortableHandleList } from './widgets/sortable-handle-list/sortable-handle-list';
import { SortableSwapList } from './widgets/sortable-swap-list/sortable-swap-list';
import { StackableSortableLists } from './widgets/stackable-sortable-lists/stackable-sortable-lists';

@Component({
  selector: 'app-tree-view',
  imports: [
    StackableSortableLists,
    SortableSwapList,
    SimpleList,
    SharedList,
    DisableList,
    SortableHandleList,
    DraggableFiltering,
    RandomSortable,
  ],
  templateUrl: './tree-view.html',
  styleUrl: './tree-view.scss',
})
export class TreeView {}
