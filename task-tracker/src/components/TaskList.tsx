"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type Task = {
    id: string;
    title: string;
    description?: string;
    done: boolean;
    createdAt: string;
};

export function TaskList() {
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [flash, setFlash] = useState<string | null>(null);

    const url = useMemo(() => {
        const params = searchParams.toString();
        return `/api/tasks${params ? `?${params}` : ""}`;
    }, [searchParams]);

    async function fetchTasks(signal?: AbortSignal) {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(url, { signal });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.error || "Failed to load tasks");
            setTasks(json.data || []);
        } catch (e: any) {
            if (e?.name !== "AbortError") setError(e.message || "Error loading tasks");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const ctl = new AbortController();
        fetchTasks(ctl.signal);
        const onChanged = () => fetchTasks(ctl.signal);
        if (typeof window !== "undefined") {
            window.addEventListener("tasks:changed", onChanged);
        }
        return () => {
            ctl.abort();
            if (typeof window !== "undefined") {
                window.removeEventListener("tasks:changed", onChanged);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url]);

    async function toggleDone(id: string, next: boolean) {
        const prev = tasks;
        setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: next } : t)));
        try {
            const res = await fetch(`/api/tasks/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ done: next }),
            });
            if (!res.ok) throw new Error();
            setFlash("Task updated");
        } catch (_) {
            setTasks(prev);
            setFlash("Failed to update task");
        }
    }

    async function remove(id: string) {
        const prev = tasks;
        setTasks((ts) => ts.filter((t) => t.id !== id));
        try {
            const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            setFlash("Task deleted");
        } catch (_) {
            setTasks(prev);
            setFlash("Failed to delete task");
        }
    }

    if (loading) return <p className="text-sm text-gray-700">Loading...</p>;
    if (error) return <p className="text-sm text-red-700" role="alert">{error}</p>;
    if (tasks.length === 0) return <p className="text-sm text-gray-700">No tasks yet</p>;

    return (
        <div className="space-y-2">
            {flash && <p className="text-sm text-gray-700">{flash}</p>}
            <ul className="divide-y rounded border border-gray-300 bg-white">
                {tasks.map((t) => (
                    <li key={t.id} className="p-3 flex items-start gap-3">
                        <input
                            id={`done-${t.id}`}
                            type="checkbox"
                            className="mt-1"
                            checked={t.done}
                            onChange={(e) => toggleDone(t.id, e.target.checked)}
                        />
                        <div className="flex-1">
                            <label htmlFor={`done-${t.id}`} className="font-medium cursor-pointer">
                                {t.title}
                            </label>
                            {t.description && (
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{t.description}</p>
                            )}
                            <p className="text-xs text-gray-500">Created {new Date(t.createdAt).toLocaleString()}</p>
                        </div>
                        <button
                            onClick={() => remove(t.id)}
                            className="text-red-700 hover:underline text-sm"
                            aria-label={`Delete ${t.title}`}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}


