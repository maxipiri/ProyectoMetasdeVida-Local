const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.timeLog.deleteMany();
  await prisma.subtask.deleteMany();
  await prisma.task.deleteMany();
  await prisma.pillar.deleteMany();

  // Create Pillars
  const workPillar = await prisma.pillar.create({
    data: {
      name: 'Trabajo & Proyectos',
      description: 'Desarrollo profesional, entregas y proyectos clave',
      color: '#3B82F6', // Blue
      icon: 'Briefcase',
      targetWeeklyHours: 20,
      targetPercentage: 40,
    },
  });

  const healthPillar = await prisma.pillar.create({
    data: {
      name: 'Salud & Bienestar',
      description: 'Ejercicio, nutrición, descanso y salud mental',
      color: '#10B981', // Emerald
      icon: 'Heart',
      targetWeeklyHours: 10,
      targetPercentage: 20,
    },
  });

  const growthPillar = await prisma.pillar.create({
    data: {
      name: 'Desarrollo Personal',
      description: 'Lectura, estudio, cursos y hábitos de mejora',
      color: '#8B5CF6', // Purple
      icon: 'BookOpen',
      targetWeeklyHours: 10,
      targetPercentage: 20,
    },
  });

  const leisurePillar = await prisma.pillar.create({
    data: {
      name: 'Ocio & Relaciones',
      description: 'Familia, amigos, hobbies y desconexión',
      color: '#F59E0B', // Amber
      icon: 'Smile',
      targetWeeklyHours: 10,
      targetPercentage: 20,
    },
  });

  // Create Sample Tasks for Today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const task1 = await prisma.task.create({
    data: {
      title: 'Planificar arquitectura del sprint y revisar PRs',
      description: 'Revisar issues pendientes y estructurar endpoints de la API',
      pillarId: workPillar.id,
      date: today,
      startTime: '09:00',
      plannedMinutes: 120,
      actualMinutes: 90,
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      subtasks: {
        create: [
          { title: 'Revisar PRs de equipo', completed: true, order: 1 },
          { title: 'Diseñar esquema de base de datos', completed: true, order: 2 },
          { title: 'Documentar endpoints principales', completed: false, order: 3 },
        ],
      },
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Entrenamiento de fuerza y cardio',
      description: 'Rutina de gimnasio de 1 hora y estiramientos',
      pillarId: healthPillar.id,
      date: today,
      startTime: '13:00',
      plannedMinutes: 60,
      actualMinutes: 60,
      status: 'COMPLETED',
      priority: 'MEDIUM',
      subtasks: {
        create: [
          { title: 'Calentamiento 10 min', completed: true, order: 1 },
          { title: 'Rutina superior', completed: true, order: 2 },
        ],
      },
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: 'Lectura de libro de arquitectura de software',
      description: 'Leer capítulos 4 y 5 de Clean Architecture',
      pillarId: growthPillar.id,
      date: today,
      startTime: '18:00',
      plannedMinutes: 45,
      actualMinutes: 0,
      status: 'PENDING',
      priority: 'MEDIUM',
      subtasks: {
        create: [
          { title: 'Leer capítulo 4', completed: false, order: 1 },
          { title: 'Tomar notas de componentes', completed: false, order: 2 },
        ],
      },
    },
  });

  const task4 = await prisma.task.create({
    data: {
      title: 'Cena familiar y caminata nocturna',
      description: 'Tiempo de calidad con la familia',
      pillarId: leisurePillar.id,
      date: today,
      startTime: '20:00',
      plannedMinutes: 90,
      actualMinutes: 0,
      status: 'PENDING',
      priority: 'LOW',
    },
  });

  // Create initial time logs
  await prisma.timeLog.create({
    data: {
      taskId: task1.id,
      pillarId: workPillar.id,
      minutes: 90,
      date: today,
      notes: 'Sesión matutina de arquitectura',
    },
  });

  await prisma.timeLog.create({
    data: {
      taskId: task2.id,
      pillarId: healthPillar.id,
      minutes: 60,
      date: today,
      notes: 'Entrenamiento completado',
    },
  });

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
