export interface Column {
  _id?: string;
  title?: string;
  priority?: number;
  tasks?: Task[];
}

export interface Task {
  description?: string;
  label?: "purple" | "blue" | "green" | "yellow" | "red" | "gray";
}
