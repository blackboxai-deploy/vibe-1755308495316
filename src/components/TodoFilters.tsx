'use client';

import { FilterStatus } from '@/types/todo';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TodoFiltersProps {
  filters: {
    status: FilterStatus;
    search: string;
  };
  sortBy: 'priority' | 'dueDate' | 'created' | 'title';
  onFiltersChange: (filters: Partial<{ status: FilterStatus; search: string }>) => void;
  onSortChange: (sortBy: 'priority' | 'dueDate' | 'created' | 'title') => void;
  todoCount: number;
}

export default function TodoFilters({
  filters,
  sortBy,
  onFiltersChange,
  onSortChange,
  todoCount,
}: TodoFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="search" className="text-sm font-medium">
            Search Todos
          </Label>
          <Input
            id="search"
            type="text"
            placeholder="Search by title, description, or category..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            className="mt-1"
          />
        </div>

        <div className="sm:w-48">
          <Label htmlFor="sort" className="text-sm font-medium">
            Sort By
          </Label>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created">Recently Created</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="title">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Filter by Status</Label>
        <Tabs
          value={filters.status}
          onValueChange={(value) => onFiltersChange({ status: value as FilterStatus })}
          className="mt-2"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {todoCount > 0 && (
        <div className="text-sm text-gray-600">
          Showing {todoCount} {todoCount === 1 ? 'todo' : 'todos'}
          {filters.search && (
            <span> matching "{filters.search}"</span>
          )}
          {filters.status !== 'all' && (
            <span> in {filters.status} status</span>
          )}
        </div>
      )}
    </div>
  );
}