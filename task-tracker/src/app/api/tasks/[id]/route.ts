import { NextRequest, NextResponse } from "next/server";
import { deleteTask, getTask, updateTask } from "@/lib/tasks";

export async function PATCH(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const body = await _req.json();
        const updated = updateTask(id, body ?? {});
        return NextResponse.json({ data: updated });
    } catch (err: any) {
        if (err?.code === "NOT_FOUND") {
            return NextResponse.json({ error: err.message }, { status: 404 });
        }
        if (err?.code === "VALIDATION_ERROR") {
            return NextResponse.json({ error: err.message, field: err.field }, { status: 400 });
        }
        return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        deleteTask(id);
        return NextResponse.json({ ok: true });
    } catch (err: any) {
        if (err?.code === "NOT_FOUND") {
            return NextResponse.json({ error: err.message }, { status: 404 });
        }
        return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
    }
}

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const task = getTask(id);
    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });
    return NextResponse.json({ data: task });
}


