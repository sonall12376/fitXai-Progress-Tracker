import { query } from '../db';
import { AiService } from './ai.service';

export class ProgressService {
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
      new Date().toISOString().split('T')[0], // log_date defaults to today
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
    // In a real app we'd build a dynamic update query. Doing a simple full replacement here.
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
   * Store the generated AI report in the database.
   */
  static async storeReport(logId: number, userId: string, report: any) {
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
      logId, userId, report.progressScore, report.confidenceScore,
      report.consistencyAnalysis, report.workoutPerformance, report.recoveryAnalysis,
      report.injuryRisk, report.userVulnerabilities, report.improvementAnalysis,
      report.goalProgress, report.personalizedRecommendations, report.motivationMessage
    ];
    
    const result = await query(text, values);
    return result.rows[0];
  }

  static async getLogByDate(userId: string, date: string) {
    const res = await query('SELECT * FROM daily_progress_logs WHERE user_id = $1 AND log_date = $2', [userId, date]);
    return res.rows[0];
  }

  static async getReportByDate(userId: string, date: string) {
    const text = `
      SELECT r.*, l.log_date as date
      FROM ai_reports r
      JOIN daily_progress_logs l ON r.log_id = l.id
      WHERE r.user_id = $1 AND l.log_date = $2
    `;
    const res = await query(text, [userId, date]);
    return res.rows[0];
  }

  static async deleteLog(userId: string, date: string) {
    const res = await query('DELETE FROM daily_progress_logs WHERE user_id = $1 AND log_date = $2 RETURNING id', [userId, date]);
    return (res.rowCount || 0) > 0;
  }
  
  static async getHistory(userId: string, limit: number, offset: number) {
      const text = `
        SELECT l.*, row_to_json(r) as report
        FROM daily_progress_logs l
        LEFT JOIN ai_reports r ON r.log_id = l.id
        WHERE l.user_id = $1
        ORDER BY l.log_date DESC
        LIMIT $2 OFFSET $3
      `;
      const res = await query(text, [userId, limit, offset]);
      return res.rows;
  }
  
  static async getSettings(userId: string) {
      const res = await query('SELECT * FROM user_ai_settings WHERE user_id = $1', [userId]);
      return res.rows[0];
  }
  
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
      const values = [userId, data.coachPersona, data.enableSafetyAlerts, JSON.stringify(data.priorityFocus), data.weeklySummaryOptIn];
      const res = await query(text, values);
      return res.rows[0];
  }
}
