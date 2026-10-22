import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();

    // Get all pillars with target hours and percentages
    const pillars = db.prepare('SELECT * FROM pillars').all() as any[];

    // Get all tasks with planned and actual minutes
    const tasks = db.prepare('SELECT * FROM tasks').all() as any[];

    // Get all time logs
    const timeLogs = db.prepare('SELECT * FROM time_logs').all() as any[];

    let totalPlannedMinutes = 0;
    let totalActualMinutes = 0;
    let completedTasksCount = 0;
    let totalTasksCount = tasks.length;

    const pillarMetrics = pillars.map((pillar) => {
      const pillarTasks = tasks.filter((t) => t.pillarId === pillar.id);
      const pillarLogs = timeLogs.filter((l) => l.pillarId === pillar.id);

      const plannedMins = pillarTasks.reduce((acc, t) => acc + (t.plannedMinutes || 0), 0);
      const actualMins = pillarLogs.reduce((acc, l) => acc + (l.minutes || 0), 0) ||
                         pillarTasks.reduce((acc, t) => acc + (t.actualMinutes || 0), 0);

      totalPlannedMinutes += plannedMins;
      totalActualMinutes += actualMins;

      const completedPillarTasks = pillarTasks.filter((t) => t.status === 'COMPLETED').length;

      return {
        id: pillar.id,
        name: pillar.name,
        color: pillar.color,
        icon: pillar.icon,
        targetWeeklyHours: pillar.targetWeeklyHours,
        targetPercentage: pillar.targetPercentage || 25,
        plannedHours: Number((plannedMins / 60).toFixed(1)),
        actualHours: Number((actualMins / 60).toFixed(1)),
        plannedMinutes: plannedMins,
        actualMinutes: actualMins,
        tasksCount: pillarTasks.length,
        completedTasksCount,
      };
    });

    // Calculate percentage distribution of actual time vs targets for Alignment Score
    let alignmentScore = 100;
    if (totalActualMinutes > 0) {
      let varianceSum = 0;
      pillarMetrics.forEach((pm) => {
        const actualShare = (pm.actualMinutes / totalActualMinutes) * 100;
        const targetShare = pm.targetPercentage;
        varianceSum += Math.abs(actualShare - targetShare);
      });
      // Max possible variance is roughly 200, compute score 0-100
      alignmentScore = Math.max(0, Math.round(100 - (varianceSum / 2)));
    }

    const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
    const completionRate = totalTasksCount > 0 ? Math.round((completedTasks / totalTasksCount) * 100) : 0;

    return NextResponse.json({
      pillarMetrics,
      summary: {
        totalPlannedHours: Number((totalPlannedMinutes / 60).toFixed(1)),
        totalActualHours: Number((totalActualMinutes / 60).toFixed(1)),
        totalTasksCount,
        completedTasksCount: completedTasks,
        completionRate,
        alignmentScore,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
