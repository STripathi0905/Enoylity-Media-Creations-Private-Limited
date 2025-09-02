"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Status = "all" | "active" | "completed";

export function Filters() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [q, setQ] = useState<string>(searchParams.get("q") || "");
    const [status, setStatus] = useState<Status>((searchParams.get("status") as Status) || "all");

    useEffect(() => {
        setQ(searchParams.get("q") || "");
        setStatus(((searchParams.get("status") as Status) || "all"));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const commit = useMemo(() => {
        let timeout: any;
        return (next: { q?: string; status?: Status }) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const params = new URLSearchParams(Array.from(searchParams.entries()));
                if (next.q !== undefined) {
                    if (next.q) params.set("q", next.q); else params.delete("q");
                }
                if (next.status) {
                    params.set("status", next.status);
                }
                router.replace(`${pathname}?${params.toString()}`);
            }, 250);
        };
    }, [pathname, router, searchParams]);

    return (
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end text-gray-900">
            <div className="flex-1">
                <label className="block text-sm font-medium mb-1" htmlFor="search">Search</label>
                <input
                    id="search"
                    className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="Search title or description"
                    value={q}
                    onChange={(e) => { setQ(e.target.value); commit({ q: e.target.value }); }}
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <div className="inline-flex rounded border border-gray-300 overflow-hidden">
                    {(["all", "active", "completed"] as Status[]).map((s) => (
                        <button
                            key={s}
                            className={`px-3 py-2 text-sm ${status === s ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-100"}`}
                            onClick={() => { setStatus(s); commit({ status: s }); }}
                            aria-pressed={status === s}
                        >
                            {s[0].toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}


