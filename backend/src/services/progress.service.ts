import { query } from '../db';
import { AiOutputPayload } from '../types/ai.types';
import { AiService } from './ai.service';

export class ProgressService {
  /**
   * Helper Function: Safely serializes JavaScript objects/arrays into JSON strings for PostgreSQL JSONB columns.
   * Prevents null/undefined serialization issues and driver-level casting anomalies.
   */
  private static serializeJsonb(val: any): string | null {
    if (val === undefined || val === null) return null;
    if (typeof val === 'string') return val;
    try {
      return JSON.stringify(val);
    } catch (err) {
      console.error('[ProgressService] JSON serialization error:', err);
      return null;
    }
  }

  /**
   * Helper Function: Deserializes database snake_case row columns into camelCase AiOutputPayload structure.
   * Aligns PostgreSQL database persistence output with AI_OUTPUT.md specifications.
   */
  public static formatAiReportRow(row: any): any | null {
    if (!row) return null;

    const parseJsonColumn = (col: any, fallback: any) => {
      if (!col) return fallback;
      if (typeof col === 'string') {
        try { return JSON.parse(col); } catch { return fallback; }
      }
      return col;
    };

    return {
      id: row.id,
      logId: row.log_id,
      userId: row.user_id,
      date: row.date || row.log_date,
      progressScore: Number(row.progress_score ?? 75),
      confidenceScore: Number(row.confidence_score ?? 0.85),
      consistencyAnalysis: parseJsonColumn(row.consistency_analysis, {
        status: 'On Track',
        completedWorkoutsCount: 0,
        missedWorkoutsCount: 0,
        weeklyAdherencePercentage: 0.0
      }),
      workoutPerformance: parseJsonColumn(row.workout_performance, {
        intensityLevel: 'Moderate',
        caloriesBurnedVariance: 0.0,
        durationVariance: 0.0,
        feedback: 'Workout recorded successfully.'
      }),
      recoveryAnalysis: parseJsonColumn(row.recovery_analysis, {
        status: 'Adequate',
        sleepQuality: 'Fair',
        hydrationStatus: 'Sub-optimal',
        fatigueLevel: 'Medium',
        insights: ['Ensure adequate water and sleep for proper recovery.']
      }),
      injuryRisk: parseJsonColumn(row.injury_risk, {
        riskLevel: 'Low',
        criticalAreas: [],
        preventativeAction: ''
      }),
      userVulnerabilities: parseJsonColumn(row.user_vulnerabilities, []),
      improvementAnalysis: parseJsonColumn(row.improvement_analysis, {
        isImproving: true,
        metricChanges: ['Baseline metrics active.'],
        primaryBottleneck: 'None identified.'
      }),
      goalProgress: parseJsonColumn(row.goal_progress, {
        status: 'On Track',
        estimatedWeeksToGoal: null,
        qualitativeAssessment: 'Progressing steadily towards fitness goal.'
      }),
      personalizedRecommendations: parseJsonColumn(row.personalized_recommendations, [
        {
          category: 'Recovery',
          priority: 'High',
          action: 'Drink at least 2.5 to 3.0 Liters of water daily.',
          rationale: 'Adequate hydration accelerates post-workout recovery and prevents cramping.'
        }
      ]),
      motivationMessage: row.motivation_message || 'Great effort today! Keep pushing consistently towards your goals.',
      createdAt: row.created_at
    };
  }

  /**
   * Orchestrates complete Daily Log creation and AI Report generation.
   */
  static async processCreateLog(userId: string, data: any) {
  console.log("========== CREATE LOG START ==========");

  const todayDate = data.date || new Date().toISOString().split('T')[0];
  console.log("Date:", todayDate);

  // Step 1
  console.log("STEP 1: Checking duplicate log...");
  const existing = await this.getLogByDate(userId, todayDate);
  console.log("STEP 1 DONE");

  if (existing) {
    const error: any = new Error("Today's metrics have already been recorded. Use PUT request to modify today's log.");
    error.statusCode = 409;
    error.code = 'DUPLICATE_LOG';
    throw error;
  }

  // Step 2
  console.log("STEP 2: Saving log to PostgreSQL...");
  const log = await this.createLog(userId, { ...data, date: todayDate });
  console.log("STEP 2 DONE");

  // Step 3
  console.log("STEP 3: Getting previous history...");
  const historyRows = await this.getHistory(userId, 7, 0);
  console.log("STEP 3 DONE");

  const historicalLogs = historyRows.map(h => ({
    date: h.log_date,
    workoutCompleted: h.workout_completed,
    workoutType: h.workout_type,
    workoutDuration: h.workout_duration,
    caloriesBurned: h.calories_burned,
    caloriesConsumed: h.calories_consumed,
    steps: h.steps,
    sleepHours: Number(h.sleep_hours),
    waterIntake: Number(h.water_intake),
    mood: h.mood,
    energyLevel: h.energy_level,
    injury: {
      hasInjury: h.has_injury,
      painLevel: h.pain_level,
      details: h.injury_details
    }
  }));

  // Step 4
  console.log("STEP 4: Getting AI settings...");
  const settingsRow = await this.getSettings(userId);
  console.log("STEP 4 DONE");

  const coachPersona = settingsRow?.coach_persona || 'Motivational';

  // Step 5
  console.log("STEP 5: Calling Gemini...");
  const reportData = await AiService.generateReport({}, historicalLogs, data, coachPersona);
  console.log("STEP 5 DONE");

  // Step 6
  console.log("STEP 6: Storing AI report...");
  const reportRecord = await this.storeReport(log.id, userId, reportData);
  console.log("STEP 6 DONE");

  console.log("========== CREATE LOG COMPLETED ==========");

  return {
    logId: log.id,
    date: log.log_date || todayDate,
    reportId: reportRecord?.id || null,
    report: reportRecord || reportData
  };
}
  // static async processCreateLog(userId: string, data: any) {
  //   const todayDate = data.date || new Date().toISOString().split('T')[0];

  //   // Check duplicate log
  //   const existing = await this.getLogByDate(userId, todayDate);
  //   if (existing) {
  //     const error: any = new Error("Today's metrics have already been recorded. Use PUT request to modify today's log.");
  //     error.statusCode = 409;
  //     error.code = 'DUPLICATE_LOG';
  //     throw error;
  //   }

  //   // 1. Save Log to PostgreSQL
  //   const log = await this.createLog(userId, { ...data, date: todayDate });

  //   // 2. Aggregate Past 7-Day History & User AI Settings
  //   const historyRows = await this.getHistory(userId, 7, 0);
  //   const historicalLogs = historyRows.map(h => ({
  //     date: h.log_date,
  //     workoutCompleted: h.workout_completed,
  //     workoutType: h.workout_type,
  //     workoutDuration: h.workout_duration,
  //     caloriesBurned: h.calories_burned,
  //     caloriesConsumed: h.calories_consumed,
  //     steps: h.steps,
  //     sleepHours: Number(h.sleep_hours),
  //     waterIntake: Number(h.water_intake),
  //     mood: h.mood,
  //     energyLevel: h.energy_level,
  //     injury: {
  //       hasInjury: h.has_injury,
  //       painLevel: h.pain_level,
  //       details: h.injury_details
  //     }
  //   }));

  //   const settingsRow = await this.getSettings(userId);
  //   const coachPersona = settingsRow?.coach_persona || 'Motivational';

  //   // 3. Generate & Store AI Report (with failover)
  //   const reportData = await AiService.generateReport({}, historicalLogs, data, coachPersona);
  //   const reportRecord = await this.storeReport(log.id, userId, reportData);

  //   return {
  //     logId: log.id,
  //     date: log.log_date || todayDate,
  //     reportId: reportRecord?.id || null,
  //     report: reportRecord || reportData
  //   };
  // }

  /**
   * Orchestrates complete Daily Log update and AI Report regeneration.
   */
  static async processUpdateLog(userId: string, date: string, data: any) {
    const existing = await this.getLogByDate(userId, date);
    if (!existing) {
      const error: any = new Error("No progress log exists for the specified date to update.");
      error.statusCode = 404;
      error.code = 'LOG_NOT_FOUND';
      throw error;
    }

    // 1. Update Log in PostgreSQL
    const updatedLog = await this.updateLog(userId, date, data);

    // 2. Aggregate Past History & User Settings
    const historyRows = await this.getHistory(userId, 7, 0);
    const historicalLogs = historyRows
      .filter(h => h.log_date !== date)
      .map(h => ({
        date: h.log_date,
        workoutCompleted: h.workout_completed,
        workoutType: h.workout_type,
        workoutDuration: h.workout_duration,
        caloriesBurned: h.calories_burned,
        caloriesConsumed: h.calories_consumed,
        steps: h.steps,
        sleepHours: Number(h.sleep_hours),
        waterIntake: Number(h.water_intake),
        mood: h.mood,
        energyLevel: h.energy_level,
        injury: {
          hasInjury: h.has_injury,
          painLevel: h.pain_level,
          details: h.injury_details
        }
      }));

    const settingsRow = await this.getSettings(userId);
    const coachPersona = settingsRow?.coach_persona || 'Motivational';

    // 3. Generate & Store AI Report
    const reportData = await AiService.generateReport({}, historicalLogs, data, coachPersona);
    const reportRecord = await this.storeReport(updatedLog.id, userId, reportData);

    return {
      logId: updatedLog.id,
      date: updatedLog.log_date || date,
      reportId: reportRecord?.id || null,
      report: reportRecord || reportData
    };
  }

  /**
   * Insert a daily progress log.
   */
  static async createLog(userId: string, data: any) {
    const text = `
      INSERT INTO daily_progress_logs (
        user_id, log_date, workout_completed, workout_type, workout_duration, 
        calories_burned, calories_consumed, steps, sleep_hours, water_intake, 
        mood, energy_level, has_injury, pain_level, injury_details, notes
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
      ) RETURNING *`;
      
    const values = [
      userId, 
      data.date || new Date().toISOString().split('T')[0],
      data.workoutCompleted,
      data.workoutType || null,
      data.workoutDuration || null,
      data.caloriesBurned || null,
      data.caloriesConsumed,
      data.steps,
      data.sleepHours,
      data.waterIntake,
      data.mood,
      data.energyLevel,
      data.injury?.hasInjury || false,
      data.injury?.painLevel || null,
      data.injury?.details || null,
      data.notes || null
    ];

    const result = await query(text, values);
    return result.rows[0];
  }

  /**
   * Update an existing daily log for a date.
   */
  static async updateLog(userId: string, date: string, data: any) {
    const text = `
      UPDATE daily_progress_logs SET
        workout_completed = $3, workout_type = $4, workout_duration = $5, 
        calories_burned = $6, calories_consumed = $7, steps = $8, sleep_hours = $9, 
        water_intake = $10, mood = $11, energy_level = $12, has_injury = $13, 
        pain_level = $14, injury_details = $15, notes = $16, updated_at = NOW()
      WHERE user_id = $1 AND log_date = $2
      RETURNING *`;
      
    const values = [
      userId, date, data.workoutCompleted, data.workoutType || null, data.workoutDuration || null,
      data.caloriesBurned || null, data.caloriesConsumed, data.steps, data.sleepHours,
      data.waterIntake, data.mood, data.energyLevel, data.injury?.hasInjury || false,
      data.injury?.painLevel || null, data.injury?.details || null, data.notes || null
    ];
    const result = await query(text, values);
    return result.rows[0];
  }

  /**
   * Stores or updates the generated AI report in the PostgreSQL database.
   */
  static async storeReport(logId: number, userId: string, report: AiOutputPayload | any) {
    const text = `
      INSERT INTO ai_reports (
        log_id, user_id, progress_score, confidence_score, consistency_analysis,
        workout_performance, recovery_analysis, injury_risk, user_vulnerabilities,
        improvement_analysis, goal_progress, personalized_recommendations, motivation_message
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
      )
      ON CONFLICT (log_id) DO UPDATE SET 
        progress_score = EXCLUDED.progress_score,
        confidence_score = EXCLUDED.confidence_score,
        consistency_analysis = EXCLUDED.consistency_analysis,
        workout_performance = EXCLUDED.workout_performance,
        recovery_analysis = EXCLUDED.recovery_analysis,
        injury_risk = EXCLUDED.injury_risk,
        user_vulnerabilities = EXCLUDED.user_vulnerabilities,
        improvement_analysis = EXCLUDED.improvement_analysis,
        goal_progress = EXCLUDED.goal_progress,
        personalized_recommendations = EXCLUDED.personalized_recommendations,
        motivation_message = EXCLUDED.motivation_message
      RETURNING *`;
      
    const values = [
      logId, 
      userId, 
      report?.progressScore ?? 75, 
      report?.confidenceScore ?? 0.85,
      this.serializeJsonb(report?.consistencyAnalysis), 
      this.serializeJsonb(report?.workoutPerformance), 
      this.serializeJsonb(report?.recoveryAnalysis),
      this.serializeJsonb(report?.injuryRisk), 
      this.serializeJsonb(report?.userVulnerabilities), 
      this.serializeJsonb(report?.improvementAnalysis),
      this.serializeJsonb(report?.goalProgress), 
      this.serializeJsonb(report?.personalizedRecommendations), 
      report?.motivationMessage || ''
    ];
    
    const result = await query(text, values);
    return this.formatAiReportRow(result.rows[0]);
  }

  /**
   * Retrieves a single daily progress log by user and date.
   */
  static async getLogByDate(userId: string, date: string) {
    const res = await query('SELECT * FROM daily_progress_logs WHERE user_id = $1 AND log_date = $2', [userId, date]);
    return res.rows[0];
  }

  /**
   * Retrieves the AI report by date, formatted to match AI_OUTPUT.md camelCase contract.
   */
  static async getReportByDate(userId: string, date: string) {
    const text = `
      SELECT r.*, l.log_date as date
      FROM ai_reports r
      JOIN daily_progress_logs l ON r.log_id = l.id
      WHERE r.user_id = $1 AND l.log_date = $2
    `;
    const res = await query(text, [userId, date]);
    return this.formatAiReportRow(res.rows[0]);
  }

  /**
   * Deletes a daily progress log.
   */
  static async deleteLog(userId: string, date: string) {
    const res = await query('DELETE FROM daily_progress_logs WHERE user_id = $1 AND log_date = $2 RETURNING id', [userId, date]);
    return (res.rowCount || 0) > 0;
  }
  
  /**
   * Retrieves historical logs and their associated formatted AI reports.
   */
  static async getHistory(userId: string, limit: number, offset: number) {
    const text = `
      SELECT l.*, row_to_json(r) as report_row
      FROM daily_progress_logs l
      LEFT JOIN ai_reports r ON r.log_id = l.id
      WHERE l.user_id = $1
      ORDER BY l.log_date DESC
      LIMIT $2 OFFSET $3
    `;
    const res = await query(text, [userId, limit, offset]);
    return res.rows.map(row => ({
      ...row,
      report: row.report_row ? this.formatAiReportRow(row.report_row) : null
    }));
  }
  
  /**
   * Retrieves user AI settings.
   */
  static async getSettings(userId: string) {
    const res = await query('SELECT * FROM user_ai_settings WHERE user_id = $1', [userId]);
    return res.rows[0];
  }
  
  /**
   * Updates or inserts user AI coaching settings.
   */
  static async updateSettings(userId: string, data: any) {
    const text = `
      INSERT INTO user_ai_settings (user_id, coach_persona, enable_safety_alerts, priority_focus, weekly_summary_opt_in)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id) DO UPDATE SET
        coach_persona = EXCLUDED.coach_persona,
        enable_safety_alerts = EXCLUDED.enable_safety_alerts,
        priority_focus = EXCLUDED.priority_focus,
        weekly_summary_opt_in = EXCLUDED.weekly_summary_opt_in,
        updated_at = NOW()
      RETURNING *
    `;
    const values = [userId, data.coachPersona, data.enableSafetyAlerts, this.serializeJsonb(data.priorityFocus), data.weeklySummaryOptIn];
    const res = await query(text, values);
    return res.rows[0];
  }
}
