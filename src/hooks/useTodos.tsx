'use client';

import { useState, useEffect, useCallback } from 'react';
import { Todo, Priority, FilterStatus, TodoStats } from '@/types/todo';
import { createTodo, updateTodo, filterTodos, sortTodos, isOverdue } from '@/lib/todoUtils';

const STORAGE_KEY = 'todos-app-data';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filters, setFilters] = useState({
    status: 'all' as FilterStatus,
    search: '',
  });
  const [sortBy, setSortBy] = useState<'priority' | 'dueDate' | 'created' | 'title'>('created');
  const [loading, setLoading] = useState(true);

  // Load todos from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const todosWithDates = parsed.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt),
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
        }));
        setTodos(todosWithDates);
      }
    } catch (error) {
      console.error('Error loading todos from localStorage:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      } catch (error) {
        console.error('Error saving todos to localStorage:', error);
      }
    }
  }, [todos, loading]);

  // Add a new todo
  const addTodo = useCallback((
    title: string,
    description?: string,
    priority: Priority = 'medium',
    dueDate?: Date,
    category?: string
  ) => {
    if (!title.trim()) return;

    const newTodo = createTodo(title, description, priority, dueDate, category);
    setTodos(prev => [newTodo, ...prev]);
  }, []);

  // Update an existing todo
  const updateTodoById = useCallback((id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? updateTodo(todo, updates) : todo
    ));
  }, []);

  // Toggle todo completion
  const toggleTodo = useCallback((id: string) => {
    updateTodoById(id, { completed: !todos.find(t => t.id === id)?.completed });
  }, [todos, updateTodoById]);

  // Delete a todo
  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  // Delete all completed todos
  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  }, []);

  // Mark all todos as complete/incomplete
  const toggleAllTodos = useCallback(() => {
    const allCompleted = todos.every(todo => todo.completed);
    setTodos(prev => prev.map(todo => updateTodo(todo, { completed: !allCompleted })));
  }, [todos]);

  // Reorder todos (for drag and drop)
  const reorderTodos = useCallback((startIndex: number, endIndex: number) => {
    setTodos(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

  // Get filtered and sorted todos
  const filteredTodos = sortTodos(
    filterTodos(todos, filters.status, filters.search),
    sortBy
  );

  // Calculate statistics
  const stats: TodoStats = {
    total: todos.length,
    completed: todos.filter(todo => todo.completed).length,
    active: todos.filter(todo => !todo.completed).length,
    overdue: todos.filter(todo => isOverdue(todo)).length,
  };

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    todos: filteredTodos,
    allTodos: todos,
    filters,
    sortBy,
    stats,
    loading,
    actions: {
      addTodo,
      updateTodoById,
      toggleTodo,
      deleteTodo,
      clearCompleted,
      toggleAllTodos,
      reorderTodos,
      updateFilters,
      setSortBy,
    },
  };
};