'use client';

import { Todo } from '@/types/todo';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onToggleTodo: (id: string) => void;
  onUpdateTodo: (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
  onDeleteTodo: (id: string) => void;
  onReorderTodos: (startIndex: number, endIndex: number) => void;
}

export default function TodoList({
  todos,
  onToggleTodo,
  onUpdateTodo,
  onDeleteTodo,
  onReorderTodos,
}: TodoListProps) {
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (dragIndex !== dropIndex) {
      onReorderTodos(dragIndex, dropIndex);
    }
  };

  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-400"></div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No todos yet</h3>
        <p className="text-gray-600 mb-4">
          Get started by adding your first todo above
        </p>
        <div className="text-sm text-gray-500">
          ✨ Tip: You can set priorities, due dates, and categories for better organization
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {todos.map((todo, index) => (
        <div
          key={todo.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
          className="cursor-move"
        >
          <TodoItem
            todo={todo}
            onToggle={() => onToggleTodo(todo.id)}
            onUpdate={(updates) => onUpdateTodo(todo.id, updates)}
            onDelete={() => onDeleteTodo(todo.id)}
          />
        </div>
      ))}
      
      {todos.length > 1 && (
        <div className="text-xs text-gray-500 text-center pt-4 border-t">
          💡 Tip: Drag and drop to reorder your todos
        </div>
      )}
    </div>
  );
}