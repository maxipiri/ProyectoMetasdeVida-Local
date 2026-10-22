import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'database.sqlite');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

class DatabaseService {
  private db: DatabaseSync;

  constructor() {
    this.db = new DatabaseSync(dbPath);
    this.initTables();
  }

  private initTables() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS pillars (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        color TEXT NOT NULL,
        icon TEXT NOT NULL,
        targetWeeklyHours REAL DEFAULT 10,
        targetPercentage REAL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        pillarId TEXT NOT NULL,
        date TEXT NOT NULL,
        startTime TEXT,
        plannedMinutes INTEGER DEFAULT 30,
        actualMinutes INTEGER DEFAULT 0,
        status TEXT DEFAULT 'PENDING',
        priority TEXT DEFAULT 'MEDIUM',
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (pillarId) REFERENCES pillars(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS subtasks (
        id TEXT PRIMARY KEY,
        taskId TEXT NOT NULL,
        title TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        "order" INTEGER DEFAULT 0,
        FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS time_logs (
        id TEXT PRIMARY KEY,
        taskId TEXT,
        pillarId TEXT NOT NULL,
        minutes INTEGER NOT NULL,
        date TEXT DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE SET NULL,
        FOREIGN KEY (pillarId) REFERENCES pillars(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed data if pillars is empty
    const countResult = this.db.prepare('SELECT COUNT(*) as count FROM pillars').get() as { count: number };
    if (countResult.count === 0) {
      this.seedDefaultData();
    }
  }

  private seedDefaultData() {
    const pillars = [
      { id: 'pillar-work', name: 'Trabajo & Proyectos', description: 'Desarrollo profesional y entregas clave', color: '#3B82F6', icon: 'Briefcase', targetWeeklyHours: 20, targetPercentage: 40 },
      { id: 'pillar-health', name: 'Salud & Bienestar', description: 'Ejercicio, nutrición y descanso', color: '#10B981', icon: 'Heart', targetWeeklyHours: 10, targetPercentage: 20 },
      { id: 'pillar-growth', name: 'Desarrollo Personal', description: 'Lectura, estudio y hábitos', color: '#8B5CF6', icon: 'BookOpen', targetWeeklyHours: 10, targetPercentage: 20 },
      { id: 'pillar-leisure', name: 'Ocio & Relaciones', description: 'Familia, amigos y hobbies', color: '#F59E0B', icon: 'Smile', targetWeeklyHours: 10, targetPercentage: 20 },
    ];

    const insertPillar = this.db.prepare(`
      INSERT INTO pillars (id, name, description, color, icon, targetWeeklyHours, targetPercentage)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of pillars) {
      insertPillar.run(p.id, p.name, p.description, p.color, p.icon, p.targetWeeklyHours, p.targetPercentage);
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const tasks = [
      {
        id: 'task-1',
        title: 'Planificar arquitectura del sprint y revisar PRs',
        description: 'Revisar issues pendientes y estructurar endpoints',
        pillarId: 'pillar-work',
        date: todayStr,
        startTime: '09:00',
        plannedMinutes: 120,
        actualMinutes: 90,
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        subtasks: [
          { id: 'sub-1', title: 'Revisar PRs de equipo', completed: 1, order: 1 },
          { id: 'sub-2', title: 'Diseñar esquema de base de datos', completed: 1, order: 2 },
          { id: 'sub-3', title: 'Documentar endpoints principales', completed: 0, order: 3 },
        ]
      },
      {
        id: 'task-2',
        title: 'Entrenamiento de fuerza y cardio',
        description: 'Rutina de gimnasio de 1 hora',
        pillarId: 'pillar-health',
        date: todayStr,
        startTime: '13:00',
        plannedMinutes: 60,
        actualMinutes: 60,
        status: 'COMPLETED',
        priority: 'MEDIUM',
        subtasks: [
          { id: 'sub-4', title: 'Calentamiento 10 min', completed: 1, order: 1 },
          { id: 'sub-5', title: 'Rutina superior', completed: 1, order: 2 },
        ]
      },
      {
        id: 'task-3',
        title: 'Lectura de arquitectura de software',
        description: 'Leer capítulos 4 y 5',
        pillarId: 'pillar-growth',
        date: todayStr,
        startTime: '18:00',
        plannedMinutes: 45,
        actualMinutes: 0,
        status: 'PENDING',
        priority: 'MEDIUM',
        subtasks: [
          { id: 'sub-6', title: 'Leer capítulo 4', completed: 0, order: 1 },
          { id: 'sub-7', title: 'Tomar notas', completed: 0, order: 2 },
        ]
      },
      {
        id: 'task-4',
        title: 'Cena familiar y caminata',
        description: 'Tiempo de calidad',
        pillarId: 'pillar-leisure',
        date: todayStr,
        startTime: '20:00',
        plannedMinutes: 90,
        actualMinutes: 0,
        status: 'PENDING',
        priority: 'LOW',
        subtasks: []
      }
    ];

    const insertTask = this.db.prepare(`
      INSERT INTO tasks (id, title, description, pillarId, date, startTime, plannedMinutes, actualMinutes, status, priority)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertSubtask = this.db.prepare(`
      INSERT INTO subtasks (id, taskId, title, completed, "order")
      VALUES (?, ?, ?, ?, ?)
    `);

    const insertLog = this.db.prepare(`
      INSERT INTO time_logs (id, taskId, pillarId, minutes, date, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const t of tasks) {
      insertTask.run(t.id, t.title, t.description, t.pillarId, t.date, t.startTime, t.plannedMinutes, t.actualMinutes, t.status, t.priority);
      for (const st of t.subtasks) {
        insertSubtask.run(st.id, t.id, st.title, st.completed, st.order);
      }
    }

    insertLog.run('log-1', 'task-1', 'pillar-work', 90, todayStr, 'Sesión matutina');
    insertLog.run('log-2', 'task-2', 'pillar-health', 60, todayStr, 'Entrenamiento completado');
  }

  public getRawDb() {
    return this.db;
  }
}

let dbInstance: DatabaseService | null = null;
export function getDb() {
  if (!dbInstance) {
    dbInstance = new DatabaseService();
  }
  return dbInstance.getRawDb();
}
