'use client';

import { useState } from 'react';
import { Todo, Priority } from '@/types/todo';
import { getPriorityColor, isOverdue, formatDate, getDaysUntilDue } from '@/lib/todoUtils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onUpdate: (updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
  onDelete: () => void;
}

export default function TodoItem({ todo, onToggle, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editPriority, setEditPriority] = useState(todo.priority);
  const [editDueDate, setEditDueDate] = useState(
    todo.dueDate ? todo.dueDate.toISOString().split('T')[0] : ''
  );
  const [editCategory, setEditCategory] = useState(todo.category || '');

  const handleSave = () => {
    if (!editTitle.trim()) return;

    onUpdate({
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
      priority: editPriority,
      dueDate: editDueDate ? new Date(editDueDate) : undefined,
      category: editCategory.trim() || undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditPriority(todo.priority);
    setEditDueDate(todo.dueDate ? todo.dueDate.toISOString().split('T')[0] : '');
    setEditCategory(todo.category || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const overdue = isOverdue(todo);
  const daysUntilDue = todo.dueDate ? getDaysUntilDue(todo.dueDate) : null;

  return (
    <Card className={`transition-all duration-200 ${
      todo.completed ? 'opacity-75 bg-gray-50' : ''
    } ${overdue ? 'border-red-200 bg-red-50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={onToggle}
            className="mt-1"
          />

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-3">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="font-medium"
                  autoFocus
                />
                
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add description..."
                  className="min-h-[60px]"
                  rows={2}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Select value={editPriority} onValueChange={(value: Priority) => setEditPriority(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />

                  <Input
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Category"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm" disabled={!editTitle.trim()}>
                    Save
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3
                    className={`font-medium text-gray-900 cursor-pointer hover:text-blue-600 ${
                      todo.completed ? 'line-through text-gray-500' : ''
                    }`}
                    onDoubleClick={() => setIsEditing(true)}
                    title="Double-click to edit"
                  >
                    {todo.title}
                  </h3>
                </div>

                {todo.description && (
                  <p className={`text-sm text-gray-600 ${
                    todo.completed ? 'line-through' : ''
                  }`}>
                    {todo.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={getPriorityColor(todo.priority)}>
                    {todo.priority} priority
                  </Badge>

                  {todo.category && (
                    <Badge variant="outline">
                      {todo.category}
                    </Badge>
                  )}

                  {todo.dueDate && (
                    <Badge variant="outline" className={overdue ? 'bg-red-100 text-red-800 border-red-200' : 
                      daysUntilDue === 0 ? 'bg-orange-100 text-orange-800 border-orange-200' :
                      daysUntilDue === 1 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''}>
                      {overdue ? '⚠️ Overdue' : 
                       daysUntilDue === 0 ? '📅 Due Today' :
                       daysUntilDue === 1 ? '📅 Due Tomorrow' :
                       `📅 ${formatDate(todo.dueDate)}`}
                    </Badge>
                  )}
                </div>

                <div className="text-xs text-gray-500">
                  Created {formatDate(todo.createdAt)}
                  {todo.updatedAt > todo.createdAt && (
                    <span> • Updated {formatDate(todo.updatedAt)}</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {!isEditing && (
            <div className="flex gap-1">
              <Button
                onClick={() => setIsEditing(true)}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                Edit
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Todo</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{todo.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}