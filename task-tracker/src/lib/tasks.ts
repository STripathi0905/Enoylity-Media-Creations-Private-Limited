export type Task = {
    id: string;
    title: string;
    description?: string;
    done: boolean;
    createdAt: string; // ISO string
};

type CreateTaskInput = {
    title: string;
    description?: string;
};

type UpdateTaskInput = Partial<Pick<Task, "title" | "description" | "done">>;

const tasks: Task[] = [];

function generateId(): string {
    const random = Math.random().toString(36).slice(2, 8);
    const time = Date.now().toString(36);
    return `${time}-${random}`;
}

export function listTasks(params?: { status?: "all" | "active" | "completed"; q?: string }) {
    const status = params?.status ?? "all";
    const query = (params?.q ?? "").trim().toLowerCase();

    return tasks.filter((task) => {
        if (status === "active" && task.done) return false;
        if (status === "completed" && !task.done) return false;
        if (query.length > 0) {
            const hay = `${task.title} ${task.description ?? ""}`.toLowerCase();
            if (!hay.includes(query)) return false;
        }
        return true;
    });
}

export function getTask(id: string): Task | undefined {
    return tasks.find((t) => t.id === id);
}

export function createTask(input: CreateTaskInput): Task {
    const title = (input.title ?? "").trim();
    if (title.length === 0) {
        const error: any = new Error("Title is required");
        error.code = "VALIDATION_ERROR";
        error.field = "title";
        throw error;
    }
    if (title.length > 120) {
        const error: any = new Error("Title must be 120 characters or fewer");
        error.code = "VALIDATION_ERROR";
        error.field = "title";
        throw error;
    }

    const task: Task = {
        id: generateId(),
        title,
        description: input.description?.trim() || undefined,
        done: false,
        createdAt: new Date().toISOString(),
    };
    tasks.unshift(task);
    return task;
}

export function updateTask(id: string, input: UpdateTaskInput): Task {
    const task = getTask(id);
    if (!task) {
        const error: any = new Error("Task not found");
        error.code = "NOT_FOUND";
        throw error;
    }
    if (input.title !== undefined) {
        const title = input.title.trim();
        if (title.length === 0) {
            const error: any = new Error("Title is required");
            error.code = "VALIDATION_ERROR";
            error.field = "title";
            throw error;
        }
        if (title.length > 120) {
            const error: any = new Error("Title must be 120 characters or fewer");
            error.code = "VALIDATION_ERROR";
            error.field = "title";
            throw error;
        }
        task.title = title;
    }
    if (input.description !== undefined) {
        task.description = input.description.trim() || undefined;
    }
    if (input.done !== undefined) {
        task.done = Boolean(input.done);
    }
    return task;
}

export function deleteTask(id: string): void {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) {
        const error: any = new Error("Task not found");
        error.code = "NOT_FOUND";
        throw error;
    }
    tasks.splice(index, 1);
}


