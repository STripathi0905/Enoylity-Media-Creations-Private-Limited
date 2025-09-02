import { Suspense } from "react";
import { TaskForm } from "@/components/TaskForm";
import { Filters } from "@/components/Filters";
import { TaskList } from "@/components/TaskList";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <main className="max-w-3xl mx-auto p-6 space-y-6">
        <header>
          <h1 className="text-2xl font-semibold">Task Tracker</h1>
          <p className="text-sm text-gray-700">Create, search, filter, toggle, and delete tasks.</p>
        </header>

        <section className="rounded border border-gray-300 bg-white p-4">
          <TaskForm />
        </section>

        <section className="rounded border border-gray-300 bg-white p-4 space-y-4">
          <Suspense fallback={<p className="text-sm text-gray-600">Loading filters…</p>}>
            <Filters />
          </Suspense>
          <Suspense fallback={<p className="text-sm text-gray-600">Loading tasks…</p>}>
            <TaskList />
          </Suspense>
        </section>
      </main>
    </div>
  );
}
