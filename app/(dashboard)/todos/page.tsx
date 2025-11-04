"use client";

import { useState } from "react";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import { ListTodo } from "lucide-react";

export default function TodosPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTodoAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <ListTodo className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Todos</h1>
          <p className="text-gray-600">Manage your tasks efficiently</p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Add Todo Form */}
        <div>
          <TodoForm onTodoAdded={handleTodoAdded} />
        </div>

        {/* Right: Todo List */}
        <div>
          <TodoList refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  );
}
