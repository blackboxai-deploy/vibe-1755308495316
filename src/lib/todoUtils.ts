import { Todo, Priority, FilterStatus } from '@/types/todo';

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const createTodo = (
  title: string, 
  description?: string, 
  priority: Priority = 'medium',
  dueDate?: Date,
  category?: string
): Todo => {
  const now = new Date();
  return {
    id: generateId(),
    title: title.trim(),
    description: description?.trim(),
    completed: false,
    priority,
    dueDate,
    category: category?.trim(),
    createdAt: now,
    updatedAt: now,
  };
};

export const updateTodo = (todo: Todo, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>): Todo => {
  return {
    ...todo,
    ...updates,
    updatedAt: new Date(),
  };
};

export const filterTodos = (todos: Todo[], status: FilterStatus, search: string = ''): Todo[] => {
  let filtered = todos;

  // Filter by status
  switch (status) {
    case 'active':
      filtered = filtered.filter(todo => !todo.completed);
      break;
    case 'completed':
      filtered = filtered.filter(todo => todo.completed);
      break;
    default:
      break;
  }

  // Filter by search
  if (search.trim()) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(todo => 
      todo.title.toLowerCase().includes(searchLower) ||
      todo.description?.toLowerCase().includes(searchLower) ||
      todo.category?.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
};

export const sortTodos = (todos: Todo[], sortBy: 'priority' | 'dueDate' | 'created' | 'title' = 'created'): Todo[] => {
  return [...todos].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.getTime() - b.dueDate.getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'created':
      default:
        return b.createdAt.getTime() - a.createdAt.getTime();
    }
  });
};

export const getPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const isOverdue = (todo: Todo): boolean => {
  if (!todo.dueDate || todo.completed) return false;
  return todo.dueDate < new Date();
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getDaysUntilDue = (dueDate: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};