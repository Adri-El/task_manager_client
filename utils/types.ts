interface Task {
  _id: string;
  id: string;
  title: string;
  description: string;
  status: string;
  completed: boolean;
  dueDate: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

export type { Task };