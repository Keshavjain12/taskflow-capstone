export interface ApiUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Project {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  owner?: ApiUser;
  createdAt: string;
  updatedAt: string;
  _count?: { tasks: number; members: number };
  members?: Array<{ id: string; role: "OWNER" | "MEMBER"; user: ApiUser }>;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  projectId: string;
  assigneeId: string | null;
  assignee?: ApiUser | null;
  creator?: ApiUser;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  authorId: string;
  author: ApiUser;
  createdAt: string;
  updatedAt: string;
}
