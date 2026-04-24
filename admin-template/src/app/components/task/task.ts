import { Component, inject } from '@angular/core';

import { Sidebar } from './widgets/sidebar/sidebar';
import { Card } from '../../shared/components/ui/card/card';
import { Table } from '../../shared/components/ui/table/table';
import { ITask } from '../../shared/interface/tasks';
import { TaskService } from '../../shared/services/task.service';

@Component({
  selector: 'app-task',
  imports: [Sidebar, Card, Table],
  templateUrl: './task.html',
  styleUrl: './task.scss',
})
export class Task {
  taskService = inject(TaskService);

  public tasks: ITask[];
  public filter = {
    status: '',
    importance: '',
  };
}
