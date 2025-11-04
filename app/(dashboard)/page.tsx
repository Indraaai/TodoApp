"use client";

import { CheckSquare, ListTodo, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-2">Welcome Back! 👋</h1>
        <p className="text-blue-100 text-lg">Ready to tackle your tasks today?</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Todos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Todos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <ListTodo className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-green-600 mt-2">8</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckSquare className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">4</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/todos"
            className="flex items-center gap-4 p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors group"
          >
            <div className="bg-blue-600 p-3 rounded-lg group-hover:scale-110 transition-transform">
              <ListTodo className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Manage Todos</h3>
              <p className="text-sm text-gray-600">View and edit your tasks</p>
            </div>
          </Link>

          <div className="flex items-center gap-4 p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-colors group cursor-pointer">
            <div className="bg-purple-600 p-3 rounded-lg group-hover:scale-110 transition-transform">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">View Progress</h3>
              <p className="text-sm text-gray-600">Check your productivity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Card */}
      <div className="bg-linear-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 p-6">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <h3 className="font-bold text-amber-900 mb-1">Pro Tip</h3>
            <p className="text-amber-800">
              Set priorities for your todos to stay focused on what matters most. High priority tasks appear with a red badge!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
