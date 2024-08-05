export interface Task {
  id: number;
  name: string;
  description: string;
  completed: boolean;
}

export interface TaskToAdd {
  name: string;
  description: string;
  completed: boolean;
}

export default Task;
