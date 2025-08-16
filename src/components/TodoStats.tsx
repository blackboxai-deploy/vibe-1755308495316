'use client';

import { TodoStats as TodoStatsType } from '@/types/todo';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface TodoStatsProps {
  stats: TodoStatsType;
}

export default function TodoStats({ stats }: TodoStatsProps) {
  const completionPercentage = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  if (stats.total === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Progress Overview</h2>
            <span className="text-sm text-gray-600">
              {Math.round(completionPercentage)}% Complete
            </span>
          </div>

          <Progress value={completionPercentage} className="h-2" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.active}</div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            
            {stats.overdue > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
                <div className="text-sm text-gray-600">Overdue</div>
              </div>
            )}
          </div>

          {stats.completed > 0 && stats.total > 0 && (
            <div className="text-center text-sm text-gray-600">
              {stats.completed === stats.total ? (
                <span className="text-green-600 font-medium">🎉 All todos completed! Great job!</span>
              ) : (
                <span>
                  {stats.active} more {stats.active === 1 ? 'todo' : 'todos'} to go!
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}