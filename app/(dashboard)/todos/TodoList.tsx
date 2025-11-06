"use client";

import { useEffect, useState } from 'react';
import { getTodos, deleteTodo, toggleTodoComplete } from '@/lib/supabase/client';
import { CheckCircle2, Circle, Trash2, Clock, AlertCircle, Inbox, Edit2, Save, X } from 'lucide-react';

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    due_date: '',
  });
  const [updating, setUpdating] = useState(false);

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

  function handleStartEdit(todo: Todo) {
    setEditingId(todo.id);
    setEditForm({
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority,
      due_date: todo.due_date || '',
    });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditForm({
      title: '',
      description: '',
      priority: 'medium',
      due_date: '',
    });
  }

  async function handleSaveEdit(id: string) {
    if (!editForm.title.trim()) {
      alert('Title is required');
      return;
    }

    try {
      setUpdating(true);
      const response = await fetch('/api/todos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          title: editForm.title,
          description: editForm.description,
          priority: editForm.priority,
          due_date: editForm.due_date,
        }),
      });

      if (!response.ok) throw new Error('Failed to update todo');

      const updatedTodo = await response.json();
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
      handleCancelEdit();
    } catch (error) {
      console.error('Error updating todo:', error);
      alert('Failed to update todo');
    } finally {
      setUpdating(false);
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
            {editingId === todo.id ? (
              /* EDIT MODE */
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={editForm.priority}
                      onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as 'low' | 'medium' | 'high' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="low">🟢 Low</option>
                      <option value="medium">🟡 Medium</option>
                      <option value="high">🔴 High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={editForm.due_date}
                      onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveEdit(todo.id)}
                    disabled={updating}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {updating ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={updating}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* VIEW MODE */
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

                {/* Action Buttons */}
                <div className="shrink-0 flex gap-2">
                  <button 
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                    onClick={() => handleStartEdit(todo)}
                    disabled={todo.completed}
                    title={todo.completed ? "Cannot edit completed todo" : "Edit todo"}
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>

                  <button 
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
