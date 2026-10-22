import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { taskId, title } = body;
    if (!taskId || !title) {
      return NextResponse.json({ error: 'taskId y title requeridos' }, { status: 400 });
    }

    const id = `sub-${crypto.randomUUID()}`;
    const db = getDb();
    
    const maxOrder = db.prepare('SELECT MAX("order") as maxOrder FROM subtasks WHERE taskId = ?').get(taskId) as { maxOrder: number };
    const nextOrder = (maxOrder?.maxOrder || 0) + 1;

    db.prepare(`
      INSERT INTO subtasks (id, taskId, title, completed, "order")
      VALUES (?, ?, ?, 0, ?)
    `).run(id, taskId, title, nextOrder);

    const subtask = db.prepare('SELECT * FROM subtasks WHERE id = ?').get(id);
    return NextResponse.json(subtask, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, completed, title } = body;
    if (!id) {
      return NextResponse.json({ error: 'id requerido' }, { status: 400 });
    }

    const db = getDb();
    if (completed !== undefined) {
      db.prepare('UPDATE subtasks SET completed = ? WHERE id = ?').run(completed ? 1 : 0, id);
    }
    if (title !== undefined) {
      db.prepare('UPDATE subtasks SET title = ? WHERE id = ?').run(title, id);
    }

    const updated = db.prepare('SELECT * FROM subtasks WHERE id = ?').get(id);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id requerido' }, { status: 400 });
    }

    const db = getDb();
    db.prepare('DELETE FROM subtasks WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
