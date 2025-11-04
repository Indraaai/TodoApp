"use client";

import { useEffect, useState } from 'react';
import { getTodos, deleteTodo, toggleTodoComplete } from '@/lib/supabase/client';
import { CheckCircle2, Circle, Trash2, Clock, AlertCircle, Inbox } from 'lucide-react';

interface Todo {
  id: string;
  title: string;
  description?: string | null;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  due_date?: string | null;
  created_at: string;
}

export default function TodoList({ refreshKey }: { refreshKey?: number }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos();
  }, [refreshKey]);

  async function fetchTodos() {
    try {
      setLoading(true);
      const response = await getTodos();
      setTodos(response);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this todo?')) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteTodo(id);
      // Remove from local state
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('Failed to delete todo');
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggleComplete(id: string, completed: boolean) {
    try {
      await toggleTodoComplete(id, completed);
      // Update local state
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed: !completed } : todo
      ));
    } catch (error) {
      console.error('Error toggling todo:', error);
      alert('Failed to update todo');
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '⚪';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="ml-3 text-gray-600">Loading todos...</p>
        </div>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <Inbox className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No todos yet</h3>
          <p className="text-gray-500">Create your first todo to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <CheckCircle2 className="h-6 w-6 text-blue-600" />
        Your Todos ({todos.length})
      </h2>

      <div className="space-y-3">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50 hover:bg-white"
          >
            <div className="flex items-start gap-4">
              {/* Checkbox */}
              <button 
                className="mt-1 shrink-0"
                onClick={() => handleToggleComplete(todo.id, todo.completed)}
              >
                {todo.completed ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                ) : (
                  <Circle className="h-6 w-6 text-gray-400 hover:text-blue-600 transition-colors" />
                )}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-semibold text-gray-900 mb-1 ${
                    todo.completed ? 'line-through text-gray-500' : ''
                  }`}
                >
                  {todo.title}
                </h3>

                {todo.description && (
                  <p className="text-sm text-gray-600 mb-2">{todo.description}</p>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  {/* Priority Badge */}
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                      todo.priority
                    )}`}
                  >
                    {getPriorityIcon(todo.priority)}
                    {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                  </span>

                  {/* Due Date */}
                  {todo.due_date && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      <Clock className="h-3 w-3" />
                      {new Date(todo.due_date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                </div>
              </div>

              {/* Delete Button */}
              <button 
                className="shrink-0 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                onClick={() => handleDelete(todo.id)}
                disabled={deletingId === todo.id}
              >
                {deletingId === todo.id ? (
                  <div className="h-5 w-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
