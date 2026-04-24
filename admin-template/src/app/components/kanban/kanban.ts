import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

export interface Columns {
  title: string;
  tasks: string[];
}

@Component({
  selector: 'app-kanban',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './kanban.html',
  styleUrl: './kanban.scss',
})
export class Kanban {
  private fb = inject(FormBuilder);

  public columns = [
    {
      title: 'In Review',
      tasks: ['Task 1', 'Task 2', 'Task 3', 'Task 4'],
    },
    {
      title: 'Pending',
      tasks: ['Task 5', 'Task 6', 'Task 7'],
    },
    {
      title: 'In Progress',
      tasks: ['Task 8', 'Task 9'],
    },
    {
      title: 'Completed',
      tasks: ['Task 10'],
    },
  ];

  public createBoardForm: FormGroup;
  public createCardForm: FormGroup;
  public draggedTaskIndex: number | null = null;
  public draggedTaskColumn: Columns | null = null;

  constructor() {
    // Initialize forms
    this.createBoardForm = this.fb.group({
      boardTitle: ['', Validators.required],
    });

    this.createCardForm = this.fb.group({
      cardText: ['', Validators.required],
      columnIndex: [null, Validators.required],
    });
  }

  // Create a new board (column)
  createBoard() {
    if (this.createBoardForm.valid) {
      const boardTitle = this.createBoardForm.value.boardTitle.trim();
      this.columns.push({ title: boardTitle, tasks: [] });
      this.createBoardForm.reset(); // Reset the form
    }
  }

  // Add a new card (task) to the selected column
  addCard() {
    if (this.createCardForm.valid) {
      const { cardText, columnIndex } = this.createCardForm.value;
      this.columns[columnIndex].tasks.push(cardText.trim());
      this.createCardForm.reset(); // Reset the form
    }
  }

  onDragStart(event: DragEvent, task: string, column: Columns, index: number) {
    this.draggedTaskIndex = index;
    this.draggedTaskColumn = column;
    event.dataTransfer?.setData('text/plain', JSON.stringify({ task }));
  }

  // Allow drop by preventing default behavior
  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  // **Move task between columns**
  onDrop(event: DragEvent, targetColumn: Columns) {
    event.preventDefault();

    const draggedData = JSON.parse(
      event.dataTransfer?.getData('text/plain') || '{}',
    );
    if (
      !draggedData ||
      !this.draggedTaskColumn ||
      this.draggedTaskIndex === null
    )
      return;

    const movedTask = this.draggedTaskColumn.tasks.splice(
      this.draggedTaskIndex,
      1,
    )[0];
    targetColumn.tasks.push(movedTask);

    this.draggedTaskColumn = null;
    this.draggedTaskIndex = null;
  }

  // **Reorder tasks inside the same column**
  onDropInsideColumn(
    event: DragEvent,
    targetColumn: Columns,
    dropIndex: number,
  ) {
    event.preventDefault();

    const draggedData = JSON.parse(
      event.dataTransfer?.getData('text/plain') || '{}',
    );
    if (
      !draggedData ||
      this.draggedTaskIndex === null ||
      !this.draggedTaskColumn
    )
      return;

    const fromColumn = this.draggedTaskColumn;
    const fromIndex = this.draggedTaskIndex;

    // Remove from old column
    const [movedTask] = fromColumn.tasks.splice(fromIndex, 1);

    // If dropping into same column and dropIndex is after the original, adjust index
    if (fromColumn === targetColumn && dropIndex > fromIndex) {
      dropIndex--;
    }

    // Insert into new column at target position
    targetColumn.tasks.splice(dropIndex, 0, movedTask);

    this.draggedTaskColumn = null;
    this.draggedTaskIndex = null;
  }
}
