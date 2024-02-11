export interface TaskI {
  id: string;
  data: TaskContent;
}

export interface TaskContent {
  assignee: string;
  author: string;
  comments: string[];
  description: string;
  title: string;
  type: string;
}
