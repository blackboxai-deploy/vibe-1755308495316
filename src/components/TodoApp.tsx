'use client';

import { useTodos } from '@/hooks/useTodos';
import AddTodoForm from './AddTodoForm';
import TodoList from './TodoList';
import TodoFilters from './TodoFilters';
import TodoStats from './TodoStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function TodoApp() {
  const { todos, allTodos, filters, sortBy, stats, loading, actions } = useTodos();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your todos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <TodoStats stats={stats} />

      {/* Add Todo Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Add New Todo</CardTitle>
        </CardHeader>
        <CardContent>
          <AddTodoForm onAddTodo={actions.addTodo} />
        </CardContent>
      </Card>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <TodoFilters
              filters={filters}
              sortBy={sortBy}
              onFiltersChange={actions.updateFilters}
              onSortChange={actions.setSortBy}
              todoCount={todos.length}
            />
            
            {allTodos.length > 0 && (
              <>
                <Separator />
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={actions.toggleAllTodos}
                    disabled={allTodos.length === 0}
                  >
                    {allTodos.every(todo => todo.completed) ? 'Mark All Active' : 'Mark All Complete'}
                  </Button>
                  
                  {stats.completed > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={actions.clearCompleted}
                    >
                      Clear Completed ({stats.completed})
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Todo List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Your Todos</span>
            {todos.length > 0 && (
              <span className="text-sm font-normal text-gray-500">
                {todos.length} {todos.length === 1 ? 'item' : 'items'}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TodoList
            todos={todos}
            onToggleTodo={actions.toggleTodo}
            onUpdateTodo={actions.updateTodoById}
            onDeleteTodo={actions.deleteTodo}
            onReorderTodos={actions.reorderTodos}
          />
        </CardContent>
      </Card>
    </div>
  );
}