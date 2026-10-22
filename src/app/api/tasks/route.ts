import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get('date'); // YYYY-MM-DD format
    const pillarId = url.searchParams.get('pillarId');

    const db = getDb();
    let query = `
      SELECT t.*, p.name as pillarName, p.color as pillarColor, p.icon as pillarIcon
      FROM tasks t
      JOIN pillars p ON t.pillarId = p.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (date) {
      query += ` AND t.date = ?`;
      params.push(date);
    }

    if (pillarId) {
      query += ` AND t.pillarId = ?`;
      params.push(pillarId);
    }

    query += ` ORDER BY t.startTime ASC, t.createdAt DESC`;

    const tasks = db.prepare(query).all(...params);

    // Fetch subtasks for each task
    const tasksWithSubtasks = tasks.map((task: any) => {
      const subtasks = db.prepare('SELECT * FROM subtasks WHERE taskId = ? ORDER BY "order" ASC').all(task.id);
      return {
        ...task,
        subtasks,
      };
    });

    return NextResponse.json(tasksWithSubtasks);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, pillarId, date, startTime, plannedMinutes, priority, subtasks } = body;

    if (!title || !pillarId || !date) {
      return NextResponse.json({ error: 'Faltan campos obligatorios (title, pillarId, date)' }, { status: 400 });
    }

    const id = `task-${crypto.randomUUID()}`;
    const db = getDb();

    db.prepare(`
      INSERT INTO tasks (id, title, description, pillarId, date, startTime, plannedMinutes, actualMinutes, status, priority)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0, 'PENDING', ?)
    `).run(
      id,
      title,
      description || '',
      pillarId,
      date,
      startTime || null,
      plannedMinutes !== undefined ? Number(plannedMinutes) : 30,
      priority || 'MEDIUM'
    );

    // Insert subtasks if provided
    if (Array.isArray(subtasks)) {
      const insertSub = db.prepare(`
        INSERT INTO subtasks (id, taskId, title, completed, "order")
        VALUES (?, ?, ?, ?, ?)
      `);
      subtasks.forEach((st: any, idx: number) => {
        const subId = `sub-${crypto.randomUUID()}`;
        insertSub.run(subId, id, st.title, st.completed ? 1 : 0, st.order !== undefined ? st.order : idx + 1);
      });
    }

    // Fetch created task with pillar & subtasks
    const task = db.prepare(`
      SELECT t.*, p.name as pillarName, p.color as pillarColor, p.icon as pillarIcon
      FROM tasks t
      JOIN pillars p ON t.pillarId = p.id
      WHERE t.id = ?
    `).get(id);

    const subs = db.prepare('SELECT * FROM subtasks WHERE taskId = ? ORDER BY "order" ASC').all(id);

    return NextResponse.json({ ...task, subtasks: subs }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
