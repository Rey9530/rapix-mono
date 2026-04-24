export interface ITodoSidebar {
  id: number;
  title: string;
  value: string;
  icon: string;
  color: string;
  count?: number;
}

export interface ITodo {
  id: number;
  task: string;
  status: string;
  date: string;
}
