import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import crypto from 'crypto';

export async function GET() {
  try {
    const db = getDb();
    const pillars = db.prepare('SELECT * FROM pillars ORDER BY createdAt ASC').all();
    return NextResponse.json(pillars);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, color, icon, targetWeeklyHours, targetPercentage } = body;

    if (!name || !color || !icon) {
      return NextResponse.json({ error: 'Faltan campos obligatorios (name, color, icon)' }, { status: 400 });
    }

    const id = `pillar-${crypto.randomUUID()}`;
    const db = getDb();
    
    db.prepare(`
      INSERT INTO pillars (id, name, description, color, icon, targetWeeklyHours, targetPercentage)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      name,
      description || '',
      color,
      icon,
      targetWeeklyHours !== undefined ? Number(targetWeeklyHours) : 10,
      targetPercentage !== undefined ? Number(targetPercentage) : null
    );

    const newPillar = db.prepare('SELECT * FROM pillars WHERE id = ?').get(id);
    return NextResponse.json(newPillar, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
