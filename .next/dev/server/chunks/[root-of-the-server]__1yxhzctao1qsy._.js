module.exports = [
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/src/app/api/pillars/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
;
;
async function GET() {
    try {
        const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
        const pillars = db.prepare('SELECT * FROM pillars ORDER BY createdAt ASC').all();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(pillars);
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        const { name, description, color, icon, targetWeeklyHours, targetPercentage } = body;
        if (!name || !color || !icon) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Faltan campos obligatorios (name, color, icon)'
            }, {
                status: 400
            });
        }
        const id = `pillar-${__TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomUUID()}`;
        const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDb"])();
        db.prepare(`
      INSERT INTO pillars (id, name, description, color, icon, targetWeeklyHours, targetPercentage)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, description || '', color, icon, targetWeeklyHours !== undefined ? Number(targetWeeklyHours) : 10, targetPercentage !== undefined ? Number(targetPercentage) : null);
        const newPillar = db.prepare('SELECT * FROM pillars WHERE id = ?').get(id);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(newPillar, {
            status: 201
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
}
}),
"[project]/src/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getDb",
    ()=>getDb
]);
var __TURBOPACK__url__external__node$3a$sqlite__ = __turbopack_context__.x("node:sqlite", ()=>require("node:sqlite"), true);
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
;
;
;
const dbPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'database.sqlite');
const dbDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].dirname(dbPath);
if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(dbDir)) {
    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(dbDir, {
        recursive: true
    });
}
class DatabaseService {
    db;
    constructor(){
        this.db = new __TURBOPACK__url__external__node$3a$sqlite__["DatabaseSync"](dbPath);
        this.initTables();
    }
    initTables() {
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
        const countResult = this.db.prepare('SELECT COUNT(*) as count FROM pillars').get();
        if (countResult.count === 0) {
            this.seedDefaultData();
        }
    }
    seedDefaultData() {
        const pillars = [
            {
                id: 'pillar-work',
                name: 'Trabajo & Proyectos',
                description: 'Desarrollo profesional y entregas clave',
                color: '#3B82F6',
                icon: 'Briefcase',
                targetWeeklyHours: 20,
                targetPercentage: 40
            },
            {
                id: 'pillar-health',
                name: 'Salud & Bienestar',
                description: 'Ejercicio, nutrición y descanso',
                color: '#10B981',
                icon: 'Heart',
                targetWeeklyHours: 10,
                targetPercentage: 20
            },
            {
                id: 'pillar-growth',
                name: 'Desarrollo Personal',
                description: 'Lectura, estudio y hábitos',
                color: '#8B5CF6',
                icon: 'BookOpen',
                targetWeeklyHours: 10,
                targetPercentage: 20
            },
            {
                id: 'pillar-leisure',
                name: 'Ocio & Relaciones',
                description: 'Familia, amigos y hobbies',
                color: '#F59E0B',
                icon: 'Smile',
                targetWeeklyHours: 10,
                targetPercentage: 20
            }
        ];
        const insertPillar = this.db.prepare(`
      INSERT INTO pillars (id, name, description, color, icon, targetWeeklyHours, targetPercentage)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
        for (const p of pillars){
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
                    {
                        id: 'sub-1',
                        title: 'Revisar PRs de equipo',
                        completed: 1,
                        order: 1
                    },
                    {
                        id: 'sub-2',
                        title: 'Diseñar esquema de base de datos',
                        completed: 1,
                        order: 2
                    },
                    {
                        id: 'sub-3',
                        title: 'Documentar endpoints principales',
                        completed: 0,
                        order: 3
                    }
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
                    {
                        id: 'sub-4',
                        title: 'Calentamiento 10 min',
                        completed: 1,
                        order: 1
                    },
                    {
                        id: 'sub-5',
                        title: 'Rutina superior',
                        completed: 1,
                        order: 2
                    }
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
                    {
                        id: 'sub-6',
                        title: 'Leer capítulo 4',
                        completed: 0,
                        order: 1
                    },
                    {
                        id: 'sub-7',
                        title: 'Tomar notas',
                        completed: 0,
                        order: 2
                    }
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
        for (const t of tasks){
            insertTask.run(t.id, t.title, t.description, t.pillarId, t.date, t.startTime, t.plannedMinutes, t.actualMinutes, t.status, t.priority);
            for (const st of t.subtasks){
                insertSubtask.run(st.id, t.id, st.title, st.completed, st.order);
            }
        }
        insertLog.run('log-1', 'task-1', 'pillar-work', 90, todayStr, 'Sesión matutina');
        insertLog.run('log-2', 'task-2', 'pillar-health', 60, todayStr, 'Entrenamiento completado');
    }
    getRawDb() {
        return this.db;
    }
}
let dbInstance = null;
function getDb() {
    if (!dbInstance) {
        dbInstance = new DatabaseService();
    }
    return dbInstance.getRawDb();
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1yxhzctao1qsy._.js.map