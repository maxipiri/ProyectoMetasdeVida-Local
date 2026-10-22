import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import crypto from 'crypto';

export async function GET() {
  try {
    const db = getDb();
    const messages = db.prepare('SELECT * FROM chat_messages ORDER BY createdAt ASC').all();
    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, action } = body;

    if (!message && !action) {
      return NextResponse.json({ error: 'Mensaje o acción requerida' }, { status: 400 });
    }

    const db = getDb();
    const userMsgId = `msg-${crypto.randomUUID()}`;
    const userText = message || getActionPrompt(action);

    db.prepare('INSERT INTO chat_messages (id, role, content) VALUES (?, ?, ?)').run(
      userMsgId,
      'user',
      userText
    );

    // Gather context for Plani
    const pillars = db.prepare('SELECT * FROM pillars').all() as any[];
    const todayStr = new Date().toISOString().split('T')[0];
    const tasks = db.prepare('SELECT * FROM tasks WHERE date = ?').all(todayStr) as any[];
    const timeLogs = db.prepare('SELECT * FROM time_logs').all() as any[];

    let assistantResponse = '';

    // Check if OpenAI API Key is configured
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      try {
        const systemPrompt = `Eres "Plani", un asistente personal de productividad y agenda inteligente inspirado en Planius. Ayudas al usuario a mantener el balance en sus Pilares de Vida (${pillars.map(p => p.name).join(', ')}), optimizar su tiempo, sugerir tareas cuando hay huecos libres y mantener alta motivación. Sé conciso, directo, empático y estructurado.`;
        
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Contexto actual (${todayStr}):\nTareas de hoy: ${JSON.stringify(tasks)}\nPilares: ${JSON.stringify(pillars)}\n\nMensaje del usuario: ${userText}` }
            ],
            temperature: 0.7,
          }),
        });

        const data = await res.json();
        if (data.choices && data.choices[0]?.message?.content) {
          assistantResponse = data.choices[0].message.content;
        }
      } catch (err) {
        console.error('OpenAI API error, falling back to local engine:', err);
      }
    }

    // Fallback or Local Intelligent Engine
    if (!assistantResponse) {
      assistantResponse = generateLocalPlaniResponse(action, userText, tasks, pillars, timeLogs);
    }

    const assistantMsgId = `msg-${crypto.randomUUID()}`;
    db.prepare('INSERT INTO chat_messages (id, role, content) VALUES (?, ?, ?)').run(
      assistantMsgId,
      'assistant',
      assistantResponse
    );

    const savedUserMsg = db.prepare('SELECT * FROM chat_messages WHERE id = ?').get(userMsgId);
    const savedAssistantMsg = db.prepare('SELECT * FROM chat_messages WHERE id = ?').get(assistantMsgId);

    return NextResponse.json({
      userMessage: savedUserMsg,
      assistantMessage: savedAssistantMsg,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function getActionPrompt(action: string): string {
  switch (action) {
    case 'free-time': return 'Tengo 45 min libres, ¿qué debería hacer?';
    case 'reorganize': return 'Ayúdame a reorganizar mi día';
    case 'summary': return 'Hazme un resumen diario de mi jornada';
    case 'pillars': return '¿Qué pilar tengo descuidado?';
    default: return 'Hola Plani, ¿cómo va mi productividad hoy?';
  }
}

function generateLocalPlaniResponse(action: string, text: string, tasks: any[], pillars: any[], timeLogs: any[]): string {
  const pendingTasks = tasks.filter(t => t.status !== 'COMPLETED');
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED');

  if (action === 'free-time' || text.includes('libres')) {
    if (pendingTasks.length === 0) {
      return `¡Tienes todas las tareas de hoy completadas! 🎉 Te sugiero dedicar este tiempo libre al pilar **Salud & Bienestar** (estiramientos, caminar) o **Ocio** para recargar energía.`;
    }
    const quickTask = pendingTasks.find(t => (t.plannedMinutes || 30) <= 45) || pendingTasks[0];
    const pillar = pillars.find(p => p.id === quickTask.pillarId);
    return `¡Perfecto! Tienes 45 minutos ideales para avanzar en la tarea **"${quickTask.title}"** del pilar *${pillar?.name || 'General'}* (${quickTask.plannedMinutes || 30} min estimados). ¿Te pongo manos a la obra?`;
  }

  if (action === 'reorganize' || text.includes('reorganizar')) {
    if (pendingTasks.length <= 1) {
      return `Tu agenda de hoy está bastante ligera y organizada. Tienes ${pendingTasks.length} pendiente principal. Te sugiero mantener el bloque actual y tomar un descanso de 10 minutos antes de continuar.`;
    }
    return `Analizando tu día: tienes ${pendingTasks.length} tareas pendientes. Te recomiendo reordenarlas por prioridad: 1) Atender **"${pendingTasks[0].title}"** (Alta prioridad), 2) Pausa activa de 15 min, y 3) Continuar con la siguiente tarea. ¡Tú puedes!`;
  }

  if (action === 'summary' || text.includes('resumen')) {
    const totalMins = timeLogs.reduce((acc, l) => acc + l.minutes, 0);
    return `📊 **Resumen de tu jornada:**\n- Tareas completadas hoy: **${completedTasks.length} de ${tasks.length}**\n- Tiempo invertido registrado: **${totalMins} minutos**\n- Estado general: ¡Buen ritmo! Mantén el enfoque en tus pilares prioritarios.`;
  }

  if (action === 'pillars' || text.includes('pilar')) {
    return `🌟 **Análisis de Pilares de Vida:**\nHe revisado tus metas semanales. Actualmente el pilar **Trabajo** tiene mayor tracción. Te sugiero programar al menos una sesión de 45 minutos en **Desarrollo Personal** o **Salud** para equilibrar tu rueda de la vida.`;
  }

  return `Hola soy **Plani**, tu asistente inteligente. Veo que tienes ${tasks.length} tareas programadas para hoy (${completedTasks.length} completadas). ¿En qué te gustaría que te ayude hoy? (Reorganizar, sugerir tareas para tiempo libre, resumen diario).`;
}
