export type Priority = 'high' | 'medium' | 'low';

export type FilterStatus = 'all' | 'active' | 'completed';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: Date;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoFilters {
  status: FilterStatus;
  priority?: Priority;
  category?: string;
  search: string;
}

export interface TodoStats {
  total: number;
  completed: number;
  active: number;
  overdue: number;
}