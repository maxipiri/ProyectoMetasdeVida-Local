import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const db = getDb();
    const logs = db.prepare(`
      SELECT tl.*, p.name as pillarName, p.color as pillarColor, t.title as taskTitle
      FROM time_logs tl
      JOIN pillars p ON tl.pillarId = p.id
      LEFT JOIN tasks t ON tl.taskId = t.id
      ORDER BY tl.date DESC
    `).all();
    return NextResponse.json(logs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { taskId, pillarId, minutes, notes, date } = body;

    if (!pillarId || minutes === undefined) {
      return NextResponse.json({ error: 'pillarId y minutes son requeridos' }, { status: 400 });
    }

    const id = `log-${crypto.randomUUID()}`;
    const logDate = date || new Date().toISOString().split('T')[0];
    const db = getDb();

    db.prepare(`
      INSERT INTO time_logs (id, taskId, pillarId, minutes, date, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, taskId || null, pillarId, Number(minutes), logDate, notes || '');

    // If associated with a task, increment actualMinutes on the task
    if (taskId) {
      db.prepare(`
        UPDATE tasks
        SET actualMinutes = actualMinutes + ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(Number(minutes), taskId);
    }

    const newLog = db.prepare(`
      SELECT tl.*, p.name as pillarName, p.color as pillarColor, t.title as taskTitle
      FROM time_logs tl
      JOIN pillars p ON tl.pillarId = p.id
      LEFT JOIN tasks t ON tl.taskId = t.id
      WHERE tl.id = ?
    `).get(id);

    return NextResponse.json(newLog, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
