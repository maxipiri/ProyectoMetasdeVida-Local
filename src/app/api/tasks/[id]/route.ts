import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, pillarId, date, startTime, plannedMinutes, actualMinutes, status, priority } = body;

    const db = getDb();
    const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!existing) {
      return NextResponse.json({ error: 'Tarea no encontrada' }, { status: 404 });
    }

    db.prepare(`
      UPDATE tasks
      SET title = COALESCE(?, title),
          description = COALESCE(?, description),
          pillarId = COALESCE(?, pillarId),
          date = COALESCE(?, date),
          startTime = COALESCE(?, startTime),
          plannedMinutes = COALESCE(?, plannedMinutes),
          actualMinutes = COALESCE(?, actualMinutes),
          status = COALESCE(?, status),
          priority = COALESCE(?, priority),
          updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      title !== undefined ? title : null,
      description !== undefined ? description : null,
      pillarId !== undefined ? pillarId : null,
      date !== undefined ? date : null,
      startTime !== undefined ? startTime : null,
      plannedMinutes !== undefined ? Number(plannedMinutes) : null,
      actualMinutes !== undefined ? Number(actualMinutes) : null,
      status !== undefined ? status : null,
      priority !== undefined ? priority : null,
      id
    );

    // If actualMinutes changed and is > 0, log time automatically or update time log
    if (actualMinutes !== undefined && Number(actualMinutes) > 0) {
      const taskObj: any = existing;
      const pId = pillarId || taskObj.pillarId;
      const logId = `log-${Date.now()}`;
      db.prepare(`
        INSERT INTO time_logs (id, taskId, pillarId, minutes, date, notes)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(logId, id, pId, Number(actualMinutes), taskObj.date, `Actualización de tiempo tarea: ${title || taskObj.title}`);
    }

    const updated = db.prepare(`
      SELECT t.*, p.name as pillarName, p.color as pillarColor, p.icon as pillarIcon
      FROM tasks t
      JOIN pillars p ON t.pillarId = p.id
      WHERE t.id = ?
    `).get(id);

    const subtasks = db.prepare('SELECT * FROM subtasks WHERE taskId = ? ORDER BY "order" ASC').all(id);

    return NextResponse.json({ ...updated, subtasks });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
