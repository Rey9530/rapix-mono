import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Sidebar } from './widgets/sidebar/sidebar';
import { sidebar, todos } from '../../shared/data/todo';
import { ITodo } from '../../shared/interface/todos';

@Component({
  selector: 'app-to-do',
  imports: [FormsModule, Sidebar],
  templateUrl: './to-do.html',
  styleUrl: './to-do.scss',
})
export class ToDo {
  public todos = todos;
  public taskValue: string = '';
  public todoSidebar = sidebar;

  ngOnInit() {
    this.getTodoCount();
  }

  getTodoCount() {
    this.todoSidebar.filter((item) => {
      if (item) {
        if (!item.count) {
          item.count = 0;
        }

        if (item.value == 'all') {
          item.count = this.todos.length;
        } else if (item.value == 'completed') {
          item.count = this.todos.filter(
            (todos) => todos.status == 'completed',
          ).length;
        } else if (item.value == 'pending') {
          item.count = this.todos.filter(
            (todos) => todos.status == 'pending',
          ).length;
        } else if (item.value == 'in_progress') {
          item.count = this.todos.filter(
            (todos) => todos.status == 'in_progress',
          ).length;
        }
      }
    });
  }

  updateStatus(event: Event, todo: ITodo) {
    const is_checked = (event.target as HTMLInputElement).checked;
    todo.status = is_checked ? 'completed' : 'in_progress';
    this.getTodoCount();
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addTask();
    }
  }

  addTask() {
    if (this.taskValue) {
      this.todos.unshift({
        id: Math.floor(Math.random() * 999) + 1,
        task: this.taskValue,
        status: 'pending',
        date: new Date().toLocaleDateString(),
      });
    }
    this.taskValue = '';
    this.getTodoCount();
  }

  deleteTask(todo: ITodo) {
    this.todos = this.todos.filter((todos) => todos.id !== todo.id);
    this.getTodoCount();
  }
}
