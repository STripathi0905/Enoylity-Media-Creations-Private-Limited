"use client";

import { useState } from "react";

export function TaskForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [ok, setOk] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setOk(null);
        if (!title.trim()) {
            setError("Title is required");
            return;
        }
        if (title.trim().length > 120) {
            setError("Title must be 120 characters or fewer");
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: title.trim(), description: description.trim() || undefined }),
            });
            const json = await res.json();
            if (!res.ok) {
                setError(json?.error || "Failed to add task");
                return;
            }
            setTitle("");
            setDescription("");
            setOk("Task added");
            if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("tasks:changed"));
            }
        } catch (_) {
            setError("Network error");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3 text-gray-900">
            <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
                <input
                    id="title"
                    className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="e.g., Write assignment"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                <textarea
                    id="description"
                    className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="Optional details"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                />
            </div>
            {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
            {ok && <p className="text-sm text-green-700">{ok}</p>}
            <div>
                <button
                    type="submit"
                    disabled={submitting}
                    className="rounded bg-blue-600 text-white px-4 py-2 disabled:opacity-60 hover:bg-blue-700"
                >
                    {submitting ? "Adding..." : "Add Task"}
                </button>
            </div>
        </form>
    );
}


