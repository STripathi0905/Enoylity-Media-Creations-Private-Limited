Task Tracker – Mini Full Stack App

Stack
- Frontend: Next.js (App Router), React, Tailwind CSS
- Backend: Next.js API routes (Node.js), in-memory store

Features
- Create tasks (title required, description optional)
- List tasks with created date and status
- Filter by status: All / Active / Completed
- Search across title and description (case-insensitive)
- Toggle done/undone, delete task
- URL query params persist filter/search state
- Clear error and success feedback

Getting Started
1. Install dependencies:
```bash
npm install
```
2. Run the development server:
```bash
npm run dev
```
3. Open http://localhost:3000 in your browser.

API
- GET /api/tasks?status=all|active|completed&q=... – list tasks
- POST /api/tasks – create task { title, description? }
- GET /api/tasks/:id – fetch one
- PATCH /api/tasks/:id – update fields { title?, description?, done? }
- DELETE /api/tasks/:id – remove task

Validation
- Title is required and must be ≤ 120 chars. Server returns 400 with { error, field }.

Notes / Trade-offs
- Uses in-memory array. Data resets on server restart.
- Optimistic updates for toggle/delete to feel fast; errors roll back UI.
- Server-side validation mirrors client checks for safety.

Improvements if extended
- Persist to a local JSON file or database.
- Add edit title/description inline.
- Add basic tests for API routes.
- Add skeleton/loading states and toasts.
