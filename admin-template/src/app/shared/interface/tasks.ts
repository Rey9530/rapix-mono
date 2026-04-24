export interface ITask {
  id: number;
  task_name: string;
  task_details: string;
  due_date: string;
  assign_to: AssignedUser[] | string;
  status: string;
  importance: string;
}

export interface AssignedUser {
  name: string;
  profile?: string;
}
