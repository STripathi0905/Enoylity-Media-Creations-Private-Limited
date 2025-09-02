import { NextRequest, NextResponse } from "next/server";
import { createTask, listTasks } from "@/lib/tasks";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const statusParam = (searchParams.get("status") || "all").toLowerCase();
    const status = ["all", "active", "completed"].includes(statusParam)
        ? (statusParam as "all" | "active" | "completed")
        : "all";
    const q = searchParams.get("q") || undefined;
    const data = listTasks({ status, q });
    return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const task = createTask({ title: body?.title ?? "", description: body?.description ?? undefined });
        return NextResponse.json({ data: task }, { status: 201 });
    } catch (err: any) {
        if (err?.code === "VALIDATION_ERROR") {
            return NextResponse.json({ error: err.message, field: err.field }, { status: 400 });
        }
        return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
    }
}


